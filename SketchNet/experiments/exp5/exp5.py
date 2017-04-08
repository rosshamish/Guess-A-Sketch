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

class Experiment5(Experiment):
    """
    Variables changed:
    - TODO Measure accuracy using a variant of the UI star-rating function, which is a log-softened
      function of two parameters:
        (1) the correct rank's label, when sorted descending by confidence, and
        (2) the correct rank's confidence, normalized like normalized = confidences/max(confidences)
    """
    _EXPERIMENT_ID = 5

    def __init__(self, log_dir=None, labels=None, name=None):
        """
        log_dir: an os.path for logs, optional
        """
        if not labels:
            raise ValueError('You have to pick some labels to train on. Theres no "all" default yet.')
        if not name:
            raise ValueError('You should give the experiment a name. If in doubt, use the name of the labels.')

        super(Experiment5, self).__init__(log_dir=log_dir, labels=labels)
        self.name = name

        self.model = SketchCNN(
            image=self.images_tensor,
            width=self._SKETCH_WIDTH,
            height=self._SKETCH_HEIGHT,
            label=self.labels_tensor,
            num_labels=len(labels),
            keep_prob=self.keep_prob_tensor)

        self.train_set, self.test_set = reload_K_splits(
            self._INPUT_DIR,
            split_within_labels=True,
            labels=labels)

    def extra_info(self):
        return self.name

def main():
    experiment = Experiment5(labels=labels.easy, name='easy')
    # 1500 => 30 mins, 15000 => 5 hours
    few, lots = 1500, 15000
    experiment.run(iterations=few, save=True)

if __name__ == '__main__':
    main()
