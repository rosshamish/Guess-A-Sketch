import sys, os
import tensorflow as tf

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from models import SketchCNNSlim
import labels
from tf.contrib.learn.python.learn.datasets import Dataset, Datasets
from datasets import sketches_dataset

_SKETCH_WIDTH = 225
_SKETCH_HEIGHT = 225

FLAGS = tf.flags.FLAGS
tf.flags.DEFINE_string("input_file_pattern", None,
                       "File pattern of sharded TFRecord files containing "
                       "tf.Example protos.")
tf.flags.DEFINE_string("train_dir", None,
                       "Directory for saving and loading checkpoints.")

tf.logging.set_verbosity(tf.logging.INFO)

def main(unused_argv):
    g = tf.Graph()
    with g.as_default():
        self.images_tensor = tf.placeholder(tf.float32, [None, _SKETCH_WIDTH, _SKETCH_HEIGHT])
        self.labels_tensor = tf.placeholder(tf.float32, [None, len(labels) if labels else 250])
        self.keep_prob_tensor = tf.placeholder(tf.float32)

        model = SketchCNNSlim(self.images_tensor, self.labels_tensor, self.keep_prob_tensor)
        model.build()

        learning_rate = 1e-3
        optimizer = tf.train.AdamOptimizer(learning_rate)

        train_tensor = tf.contrib.slim.learning.create_train_op(
            total_loss=model.total_loss,
            optimizer=optimizer,
            global_step=model.global_step)

        saver = tf.train.Saver()

    tf.contrib.slim.learning.train(
      train_op=train_tensor,
      logdir=FLAGS.train_dir,
      graph=g,
      global_step=model.global_step,
      number_of_steps=FLAGS.iterations,
      save_summaries_secs=600,
      saver=saver,
      save_interval_secs=600)


if __name__ == '__main__':
    tf.app.run()