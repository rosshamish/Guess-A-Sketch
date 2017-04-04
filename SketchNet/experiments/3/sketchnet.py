import sys, os
import time
import tensorflow as tf
from tqdm import tqdm
import numpy as np
import logging
log = logging.getLogger(__name__)

sys.path.append(os.path.join(os.path.dirname(__file__),'../../'))

from utils.tf_graph_scope import define_scope
from preprocessing.data_prep import get_batch, get_batch_by_label, reload_K_splits
from utils.base_model import Model

conv2d = tf.nn.conv2d
max_pool = tf.nn.max_pool
relu = tf.nn.relu
slim = tf.contrib.slim

class Experiment(object):
    __NUM_LABELS = 250
    __SKETCH_WIDTH = 225
    __SKETCH_HEIGHT = 225
    __BATCH_SIZE = 135
    __INPUT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'png')

    def __init__(self, log_dir=None):
        """
        model: a utils.Model to train and test
        log_dir: an os.path for logs, optional
        """
        self.log_dir = log_dir or os.path.join('tmp', 'tensorflow')

        # TensorFlow placeholders (memory allocations)
        self.image = tf.placeholder(tf.float32,
            [None, Experiment.__SKETCH_WIDTH, Experiment.__SKETCH_HEIGHT])
        self.label = tf.placeholder(tf.float32,
            [None, Experiment.__NUM_LABELS])
        self.keep_prob = tf.placeholder(tf.float32)

        self.model = EasySketchCNN(
            image=self.image,
            width=self.__SKETCH_WIDTH,
            height=self.__SKETCH_HEIGHT,
            num_labels=self.__NUM_LABELS,
            label=self.label,
            keep_prob=0.5)

        self.train_set, self.test_set = reload_K_splits(
            self.__INPUT_DIR,
            split_within_labels=True)

        # Initialize the FileWriter
        # tf.summary.scalar('accuracy', model.accuracy)
        self.summary = tf.summary.merge_all()
        summary_dir = os.path.join(self.log_dir, self._timestamp())
        self.writer = tf.summary.FileWriter(summary_dir, graph=tf.get_default_graph())

    def _timestamp(self):
        return time.strftime("%Y%m%d-%H%M%S")

    def run(self, save=True):
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        with tf.Session(config=config) as sess:
            self._train(sess, save=save)
            self._test(sess)

    def retest(self, timestamp):
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        with tf.Session(config=config) as sess:
            self._restore(sess,
                chkpt_directory=os.path.join(__file__),
                meta_file='{}.meta'.format(self._save_path(timestamp)))
            self._test(sess)

    def _restore(self, sess, chkpt_directory, meta_file):
        saver = tf.train.import_meta_graph(meta_file)
        saver.restore(sess, tf.train.latest_checkpoint(chkpt_directory))
        self.image = tf.get_collection('inputs')[0]
        self.label = tf.get_collection('inputs')[1]
        self.keep_prob = tf.get_collection('inputs')[2]

    def _save_path(self, timestamp=None):
        if not timestamp:
            timestamp = self._timestamp()
        this_dir = os.path.dirname(os.path.realpath(__file__))
        this_save_prefix = '{}-trained-{}'.format(__file__.split('.')[-2], self._timestamp())
        return os.path.join(this_dir, this_save_prefix)

    def _train(self, sess, save=True):
        ITERATIONS = int(15e3)
        init = tf.global_variables_initializer()
        sess.run(init)

        for i in tqdm(range(ITERATIONS)):
            training_batch = get_batch_by_label(
                batch_size=self.__BATCH_SIZE,
                dims=(self.__SKETCH_WIDTH, self.__SKETCH_HEIGHT),
                num_labels=self.__NUM_LABELS,
                from_set=self.train_set)
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
                print("step %d, training accuracy %g" % (i, train_accuracy))
                test_batch = get_batch_by_label(
                    batch_size=self.__BATCH_SIZE,
                    dims=(self.__SKETCH_WIDTH, self.__SKETCH_HEIGHT),
                    num_labels=self.__NUM_LABELS,
                    from_set=self.test_set)
                during_training_test_accuracy = sess.run(self.model.accuracy, {
                    self.image: test_batch[0],
                    self.label: test_batch[1],
                    self.keep_prob: 1.0
                })
                print("step %d, training accuracy %g" % (i, during_training_test_accuracy))
        if save:
            self._save(sess)

    def _test(self, sess):
        test_batch = get_batch_by_label(
            batch_size=self.__BATCH_SIZE,
            dims=(self.__SKETCH_WIDTH, self.__SKETCH_HEIGHT),
            num_labels=self.__NUM_LABELS,
            from_set=self.test_set)
        accuracy = sess.run(self.model.accuracy, {
            self.image: test_batch[0],
            self.label: test_batch[1],
            self.keep_prob: 1.0
        })
        print("test accuracy %g" % accuracy)

    def _save(self, sess):
        tf.add_to_collection('inputs', self.image)
        tf.add_to_collection('inputs', self.label)
        tf.add_to_collection('inputs', self.keep_prob)
        tf.add_to_collection('output', self.model.prediction)
        saver = tf.train.Saver()
        path = saver.save(sess, self._save_path())
        print("Model saved to {}".format(path))

class EasySketchCNN(Model):
    """ Trying to get good results on an easy dataset.
    """
    labels = []
    EXPERIMENT_ID = 3;

    def conv_pools(self, input_tensor):
        filter_1 = 64
        filter_2 = 128
        filter_3 = 256

        # Layer 1, 64 features
        h_conv1 = slim.conv2d(input_tensor, filter_1, kernel_size=15, stride=3, padding='VALID')
        h_pool1 = slim.max_pool2d(h_conv1, stride=2, kernel_size=[3, 3])

        # Layer 2, 128 features
        h_conv2 = slim.conv2d(h_pool1, filter_2, kernel_size=5, stride=1, padding='VALID')
        h_pool2 = slim.max_pool2d(h_conv2, stride=2, kernel_size=[3, 3])

        # Layer 3, three convs with 256 features
        h_conv3 = slim.conv2d(h_pool2, filter_3, kernel_size=3, stride=1)
        h_conv4 = slim.conv2d(h_conv3, filter_3, kernel_size=3, stride=1)
        h_conv5 = slim.conv2d(h_conv4, filter_3, kernel_size=3, stride=1)
        h_pool5 = slim.max_pool2d(h_conv5, stride=2, kernel_size=3, padding='VALID')

        return tf.reshape(h_pool5, [-1, 7 * 7 * filter_3])

    def fc_dropout(self, input_tensor):
        filter_fc = 512

        h_fc1 = slim.fully_connected(input_tensor, filter_fc)
        h_fc1_drop = tf.nn.dropout(h_fc1, self.keep_prob)
        h_fc2 = slim.fully_connected(h_fc1_drop, filter_fc)
        h_fc2_drop = tf.nn.dropout(h_fc2, self.keep_prob)
        return slim.fully_connected(h_fc2_drop, self.num_labels)

    @define_scope
    def prediction(self):
        x_image = tf.reshape(self.image, [-1, self.width, self.height, 1])
        flat_conv_pools = self.conv_pools(x_image)
        y = self.fc_dropout(flat_conv_pools)
        return y

    @define_scope
    def train(self):
        # tf.summary.scalar('cross_entropy', cross_entropy)
        return tf.train.AdamOptimizer(1e-4).minimize(self.loss())

    def loss(self):
        measure = tf.nn.softmax_cross_entropy_with_logits(
            labels=self.label,
            logits=self.prediction)
        return tf.reduce_mean(measure)

    @define_scope
    def accuracy(self):
        correct_confidence = tf.equal(self.prediction, self.label)
        return tf.reduce_mean(tf.cast(correct_confidence, tf.float32))


def main():
    experiment = Experiment()
    experiment.run()

if __name__ == '__main__':
    main()
