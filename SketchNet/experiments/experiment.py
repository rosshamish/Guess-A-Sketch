import sys, os
import time
import tensorflow as tf
from tqdm import tqdm
import logging
log = logging.getLogger(__name__)

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from preprocessing.data_prep import get_batch_by_label, reload_K_splits

class Experiment(object):
    """ Do not create one of these directly. Subclass instead. """
    _EXPERIMENT_ID = None

    _SKETCH_WIDTH = 225
    _SKETCH_HEIGHT = 225
    _BATCH_SIZE = 135
    _INPUT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'png')
    # Keep in sync with SketchNet/api/api.py, TODO refactor
    _MODEL_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'trained_models')

    def __init__(self, log_dir=None, summary_setup=None, labels=None):
        """
        log_dir: an os.path for logs, optional
        """
        # if summary_setup is None or not callable(summary_setup):
        #     raise NotImplementedError('Subclass must implement a summary setup method')

        self.log_dir = log_dir or os.path.join('summaries', str(self.id()))
        print('Tensorboard summaries saved to {}'.format(self.log_dir))

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

        # TensorFlow placeholders (memory allocations)
        # Legacy support:
        # - support old experiments which don't pass the `labels` parameter, and expect
        #   the whole original dataset of 250 labels.
        # - support old experiments which use the old names of these tensors
        self.images_tensor = tf.placeholder(tf.float32, [None, self._SKETCH_WIDTH, self._SKETCH_HEIGHT])
        self.labels_tensor = tf.placeholder(tf.float32, [None, len(labels) if labels else 250])
        self.keep_prob_tensor = tf.placeholder(tf.float32)
        self.image = self.images_tensor
        self.label = self.labels_tensor
        self.keep_prob = self.keep_prob_tensor

        # Initialize the FileWriter
        summary_dir = os.path.join(self.log_dir, self._timestamp())
        self.writer = tf.summary.FileWriter(summary_dir, graph=tf.get_default_graph())

    def id(self):
        """ An integer is best. Or a string. Will be included in the saved model's filename """
        if not self._EXPERIMENT_ID:
            raise NotImplementedError('Subclass must declare an experiment id')
        return self._EXPERIMENT_ID

    def extra_info(self):
        """ Subclasses can implement. Will be included in the saved model's filename """
        return ''

    def _timestamp(self):
        return time.strftime("%Y%m%d-%H%M%S")

    def run(self, iterations=15000, save=True):
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        with tf.Session(config=config) as sess:
            self._train(sess, iterations=iterations)
            accuracy = self._test(sess)
            if save:
                self._save(sess, accuracy=accuracy, iterations=iterations)

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
        self.images_tensor = tf.get_collection('inputs')[0]
        self.keep_prob_tensor = tf.get_collection('inputs')[1]

    def _save_path(self, timestamp=None, iterations=None, accuracy=None):
        if not timestamp:
            timestamp = self._timestamp()
        if not iterations:
            iterations = '?'
        if not accuracy:
            accuracy = '?'
        else:
            accuracy = '{:.2f}'.format(accuracy)[2:] # 0.20423102 -> 20
        trained_model_name = '{timestamp}_{experiment}_{model}-{iterations}iters-{accuracy}p'.format(
            timestamp=timestamp,
            experiment=self._experiment_id_and_extra_info(),
            model=self.model._NAME,
            iterations=iterations,
            accuracy=accuracy)
        return os.path.join(self._save_dir(), trained_model_name)

    def _save_dir(self):
        return os.path.join(self._MODEL_OUTPUT_DIR, self._experiment_id_and_extra_info())

    def _experiment_id_and_extra_info(self):
        return 'exp{}{}'.format(self.id(), self.extra_info())

    def _training_batch(self, batch_size=None):
        if not batch_size:
            batch_size = self._BATCH_SIZE
        if not self.train_set:
            raise NotImplementedError('Subclass must populate test_set')
        training_batch = get_batch_by_label(
            batch_size=self._BATCH_SIZE,
            dims=(self._SKETCH_WIDTH, self._SKETCH_HEIGHT),
            num_labels=self.model.num_labels,
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
            num_labels=self.model.num_labels,
            from_set=self.test_set)
        return test_batch

    def _train(self, sess, iterations):
        init = tf.global_variables_initializer()
        sess.run(init)

        for i in tqdm(range(int(iterations))):
            training_batch = self._training_batch()
            sess.run(self.model.train, {
                self.images_tensor: training_batch[0],
                self.labels_tensor: training_batch[1],
                self.keep_prob_tensor: 0.5,
            })
            if i % 100 == 0:
                train_accuracy, summ = sess.run([self.model.accuracy, self.model.summary], {
                    self.images_tensor: training_batch[0],
                    self.labels_tensor: training_batch[1],
                    self.keep_prob_tensor: 1.0
                })
                self.writer.add_summary(summ, i)
                self.writer.flush()

                print("step %d, training accuracy %g" % (i, train_accuracy))
                test_batch = self._test_batch()
                during_training_test_accuracy = sess.run(self.model.accuracy, {
                    self.images_tensor: test_batch[0],
                    self.labels_tensor: test_batch[1],
                    self.keep_prob_tensor: 1.0
                })
                print("step %d, test accuracy %g" % (i, during_training_test_accuracy))

    def _test(self, sess):
        test_batch = self._test_batch()
        accuracy = sess.run(self.model.accuracy, {
            self.images_tensor: test_batch[0],
            self.labels_tensor: test_batch[1],
            self.keep_prob_tensor: 1.0,
        })
        print("test accuracy %g" % accuracy)
        return accuracy

    def _save(self, sess, accuracy='?', iterations=None):
        tf.add_to_collection('inputs', self.images_tensor)
        tf.add_to_collection('inputs', self.keep_prob_tensor)
        tf.add_to_collection('output', self.model.prediction)
        # TODO enable once this doesnt crash
        # tf.add_to_collection('embedding', self.model.img_embedding)
        saver = tf.train.Saver()
        t = self._timestamp()
        save_path = self._save_path(timestamp=t, accuracy=accuracy, iterations=iterations)
        self._mkdir_p(save_path)
        save_path = saver.save(sess, save_path)
        print("Saving experiment {} with accuracy {:.3f} after {} iterations. Trained model saved to {}".format(
            self._experiment_id_and_extra_info(), accuracy, iterations, save_path))

    def _mkdir_p(self, filepath):
        """ Makes all directories that filepath will be in, like mkdir -p
        Attribution: Krumelur
        Source: StackOverflow
        URL: http://stackoverflow.com/a/12517490
        Accessed: April 6, 2017
        """
        if not os.path.exists(os.path.dirname(filepath)):
            try:
                os.makedirs(os.path.dirname(filepath))
            except OSError as exc: # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise
