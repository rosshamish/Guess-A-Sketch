import sys, os
import time
import tensorflow as tf
from tqdm import tqdm
import numpy as np
import logging
log = logging.getLogger(__name__)

sys.path.append(os.path.join(os.path.dirname(__file__),'../../'))

import experiments
from utils.base_model import Model
from utils.tf_graph_scope import define_scope
from preprocessing.data_prep import get_batch, get_batch_by_label, reload_K_splits

conv2d = tf.nn.conv2d
max_pool = tf.nn.max_pool
relu = tf.nn.relu
slim = tf.contrib.slim

class Experiment4(experiments.Experiment):
    """
    Variables changed:
    - Train on a particular subset of labels, passed as a constructor parameter. The idea
      is to learn a specific category, e.g. animals, food, vehicles, ...
    - Measure accuracy using a variant of the UI star-rating function, which is a log-softened
      function of two parameters:
        (1) the correct rank's label, when sorted descending by confidence, and
        (2) the correct rank's confidence, normalized like normalized = confidences/max(confidences)
    """
    __EXPERIMENT_ID = 4

    def __init__(self, log_dir=None):
        """
        model: a utils.Model to train and test
        log_dir: an os.path for logs, optional
        """
        super(experiments.Experiment, self).__init__(log_dir=log_dir)

        # TensorFlow placeholders (memory allocations)
        self.image = tf.placeholder(tf.float32,
            [None, self.__SKETCH_WIDTH, self.__SKETCH_HEIGHT])
        self.label = tf.placeholder(tf.float32,
            [None, self.__NUM_LABELS])
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

def main():
    experiment = Experiment4()
    experiment.run(iterations=1500) # 1500 => 30 mins

if __name__ == '__main__':
    main()
