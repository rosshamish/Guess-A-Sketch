import sys, os
import time
import tensorflow as tf
from tqdm import tqdm
import numpy as np
import logging
log = logging.getLogger(__name__)

sys.path.append(os.path.join(os.path.dirname(__file__),'../../'))

import labels
from experiments.experiment import Experiment
from models.SketchCNN import SketchCNN # TODO use StarCNN
from utils.tf_graph_scope import define_scope
from preprocessing.data_prep import reload_K_splits

class Experiment4(Experiment):
    """
    Variables changed:
    - Train on a particular subset of labels, passed as a constructor parameter. The idea
      is to learn a specific category, e.g. animals, food, vehicles, ...
    - TODO Measure accuracy using a variant of the UI star-rating function, which is a log-softened
      function of two parameters:
        (1) the correct rank's label, when sorted descending by confidence, and
        (2) the correct rank's confidence, normalized like normalized = confidences/max(confidences)
    """
    _EXPERIMENT_ID = 4

    def __init__(self, log_dir=None, labels=None, name=None):
        """
        log_dir: an os.path for logs, optional
        """
        if not labels:
            raise ValueError('You have to pick some labels to train on. Theres no "all" default yet.')
        if not name:
            raise ValueError('You should give the experiment a name. If in doubt, use the name of the labels.')

        super(Experiment4, self).__init__(log_dir=log_dir)
        self.name = name

        # TensorFlow placeholders (memory allocations)
        self.image = tf.placeholder(tf.float32,
            [None, self._SKETCH_WIDTH, self._SKETCH_HEIGHT])
        self.label = tf.placeholder(tf.float32,
            [None, len(labels)])
        self.keep_prob = tf.placeholder(tf.float32)

        self.model = SketchCNN(
            image=self.image,
            width=self._SKETCH_WIDTH,
            height=self._SKETCH_HEIGHT,
            label=self.label,
            num_labels=len(labels),
            keep_prob=0.5)

        self.train_set, self.test_set = reload_K_splits(
            self._INPUT_DIR,
            split_within_labels=True,
            labels=labels)

    def extra_info(self):
        return self.name

def main():
    experiment = Experiment4(labels=labels.easy, name='easy')
    # 1500 => 30 mins, 15000 => 5 hours
    few, lots = 1500, 15000
    experiment.run(iterations=lots, save=True)

if __name__ == '__main__':
    main()
