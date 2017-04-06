import sys, os
import time
import tensorflow as tf
from tqdm import tqdm
import numpy as np
import logging
log = logging.getLogger(__name__)

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from utils.tf_graph_scope import define_scope
from preprocessing.data_prep import get_batch_by_label, reload_K_splits

conv2d = tf.nn.conv2d
max_pool = tf.nn.max_pool
relu = tf.nn.relu
slim = tf.contrib.slim

class Experiment(object):
    """ Do not create one of these directly. Subclass instead. """
    _EXPERIMENT_ID = None

    _SKETCH_WIDTH = 225
    _SKETCH_HEIGHT = 225
    _BATCH_SIZE = 135
    _INPUT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'png')
    _MODEL_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'trained_models')

    def __init__(self, log_dir=None):
        """
        log_dir: an os.path for logs, optional
        """
        self.log_dir = log_dir or os.path.join('tmp', 'tensorflow')

        # Subclasses must provide these, both lists should look like:
        # - [
        #     [
        #       ('path/to/a/0.png', a_label_num),
        #       ('path/to/a/0.png', a_label_num),
        #       ...
        #     ],
        #     [
        #       ('path/to/b/0.png', b_label_num),
        #       ('path/to/b/1.png', b_label_num),
        #       ...
        #     ],
        #     ...
        #   ]
        self.train_set, self.test_set = None, None

        # Subclasses must provide a utils.Model
        self.model = None

        # Initialize the FileWriter
        # tf.summary.scalar('accuracy', model.accuracy)
        self.summary = tf.summary.merge_all()
        summary_dir = os.path.join(self.log_dir, self._timestamp())
        self.writer = tf.summary.FileWriter(summary_dir, graph=tf.get_default_graph())

    def id(self):
        if not self._EXPERIMENT_ID:
            raise NotImplementedError('Subclass must declare an experiment id')
        return self._EXPERIMENT_ID

    def _timestamp(self):
        return time.strftime("%Y%m%d-%H%M%S")

    def run(self, iterations=15000, save=True):
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        with tf.Session(config=config) as sess:
            self._train(sess, iterations=iterations)
            accuracy = self._test(sess)
            self._save(sess, accuracy=accuracy)

    def retest(self, timestamp):
        """ Untested. Might work """
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        with tf.Session(config=config) as sess:
            self._restore(sess,
                meta_file='{}.meta'.format(self._save_path(timestamp)),
                chkpt_directory=os.path.join(__file__))
            self._test(sess)

    def _restore(self, sess, meta_file, chkpt_directory):
        saver = tf.train.import_meta_graph(meta_file)
        saver.restore(sess, tf.train.latest_checkpoint(chkpt_directory))
        # TODO abstract the below if we need to
        self.image = tf.get_collection('inputs')[0]
        self.label = tf.get_collection('inputs')[1]
        self.keep_prob = tf.get_collection('inputs')[2]

    def _save_path(self, timestamp=None):
        if not timestamp:
            timestamp = self._timestamp()
        trained_model_name = 'exp{}-trained-{}-{}'.format(self.id(), self.model._NAME, timestamp)
        return os.path.join(self._MODEL_OUTPUT_DIR, trained_model_name)

    def _training_batch(self, batch_size=None):
        if not batch_size:
            batch_size = self._BATCH_SIZE
        if not self.train_set:
            raise NotImplementedError('Subclass must populate test_set')
        training_batch = get_batch_by_label(
            batch_size=self._BATCH_SIZE,
            dims=(self._SKETCH_WIDTH, self._SKETCH_HEIGHT),
            num_labels=self.__NUM_LABELS,
            from_set=self.train_set)
        return training_batch

    def _test_batch(self, batch_size=None):
        if not batch_size:
            batch_size = self._BATCH_SIZE
        if not self.test_set:
            raise NotImplementedError('Subclass must populate test_set')
        test_batch = get_batch_by_label(
            batch_size=self._BATCH_SIZE,
            dims=(self._SKETCH_WIDTH, self._SKETCH_HEIGHT),
            num_labels=self.__NUM_LABELS,
            from_set=self.test_set)
        return test_batch

    def _train(self, sess, iterations):
        init = tf.global_variables_initializer()
        sess.run(init)

        for i in tqdm(range(int(iterations))):
            training_batch = self._training_batch()
            sess.run(self.model.train, {
                self.image: training_batch[0],
                self.label: training_batch[1],
                self.keep_prob: self.model.keep_prob,
            })
            if i % 100 == 0:
                # summary, train_accuracy = sess.run([summary, model.accuracy], {image: batch[0], label: batch[1], keep_prob: 1.0})
                train_accuracy = sess.run(self.model.accuracy, {
                    self.image: training_batch[0],
                    self.label: training_batch[1],
                    self.keep_prob: 1.0
                })
                # writer.add_summary(summary, i)
                log.debug("step %d, training accuracy %g" % (i, train_accuracy))
                test_batch = self._test_batch()
                during_training_test_accuracy = sess.run(self.model.accuracy, {
                    self.image: test_batch[0],
                    self.label: test_batch[1],
                    self.keep_prob: 1.0
                })
                log.debug("step %d, test accuracy %g" % (i, during_training_test_accuracy))

    def _test(self, sess):
        test_batch = self._test_batch()
        accuracy = sess.run(self.model.accuracy, {
            self.image: test_batch[0],
            self.label: test_batch[1],
            self.keep_prob: 1.0
        })
        log.info("test accuracy %g" % accuracy)
        return accuracy

    def _save(self, sess, accuracy='?'):
        tf.add_to_collection('inputs', self.image)
        tf.add_to_collection('inputs', self.label)
        tf.add_to_collection('inputs', self.keep_prob)
        tf.add_to_collection('output', self.model.prediction)
        saver = tf.train.Saver()
        t = self._timestamp()
        p = self._save_path(timestamp=t)
        os.makedirs(os.path.dirname(p))
        path = saver.save(sess, p)
        log.info("Experiment {} @ {}: Accuracy {}. Trained model saved to {}".format(
            self.id(), t, accuracy, path))