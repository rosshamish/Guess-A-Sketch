import sys, os
import argparse
import time
import tensorflow as tf
from tqdm import tqdm
import numpy as np
import logging
log = logging.getLogger(__name__)

sys.path.append(os.path.join(os.path.dirname(__file__),'../../'))

import labels
from experiments.experiment import Experiment
from models.SketchCNNConfigurable import SketchCNNConfigurable
from utils.tf_graph_scope import define_scope
from preprocessing.data_prep import reload_K_splits

class Experiment7(Experiment):
    """
    Experiment5, but with args, so that you can batch-train with a shell script.
    """
    _EXPERIMENT_ID = 7

    def __init__(self, log_dir=None, labels=None, name=None, model_config=None):
        """
        log_dir: an os.path for logs, optional
        """
        if not labels:
            raise ValueError('You have to pick some labels to train on. Theres no "all" default yet.')
        if not name:
            raise ValueError('You should give the experiment a name. If in doubt, use the name of the labels.')

        super(Experiment7, self).__init__(log_dir=log_dir, labels=labels)
        self.name = name

        self.model = SketchCNNConfigurable(
            image=self.images_tensor,
            width=self._SKETCH_WIDTH,
            height=self._SKETCH_HEIGHT,
            label=self.labels_tensor,
            num_labels=len(labels),
            keep_prob=self.keep_prob_tensor,
            config=model_config)

        self.train_set, self.test_set = reload_K_splits(
            self._INPUT_DIR,
            split_within_labels=True,
            labels=labels)

    def extra_info(self):
        return self.name

def main(args):
    model_config = dict()
    if args.learning_rate is not None:
        model_config['learning_rate'] = args.learning_rate
    # TODO use the other args to configure the model
    # 'convs': [
    #     { 'filter_size': fs, 'kernel_size': ks }
    #     for fs, ks in zip(args.filter_sizes, args.kernel_sizes)
    # ],
    # 'fully_connected': [
    #     { 'nodes': nodes }
    #     for nodes in args.fc_nodes
    # ]
    experiment = Experiment7(labels=labels.labels[args.labels], name=args.name, model_config=model_config)
    log.info('Successfully created experiment={name}. Training on labels={labels}'.format(
        name=args.name, labels=args.labels))

    will_save = not args.no_save
    log.info('Running {iterations} iterations.'.format(iterations=args.iterations))
    if will_save:
        log.info('Will save after training in {savePath}'.format(savePath=experiment._save_dir()))
    else:
        log.warn('Model will NOT be saved. Check the --no-save flag. Only use this mode for testing')
    experiment.run(iterations=args.iterations, save=will_save)

def sanitize(args):
    if args.name is None:
        args.name = args.labels
    return args

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run an experiment using SketchCNN.')
    parser.add_argument('-l', '--labels', help='Labels to train on.',
        choices=set(labels.labels.keys()),
        default='standard')
    parser.add_argument('-n', '--name', help='Name of the run. The full name will be exp7name.',
        default=None)
    parser.add_argument('-i', '--iterations', dest='iterations', type=int,
        help='How many iterations of training. 500, 1500, 15000 -> 10 mins, 30 mins, 5 hours.',
        default=1)
    parser.add_argument('-r', '--learning-rate', dest='learning_rate', type=float,
        default=None)
    parser.add_argument('--no-save', dest='no_save', help='Don\'t save the trained model to file', action='store_true')
    # parser.add_argument('--filter-sizes', dest='filter_sizes', nargs=3)
    # parser.add_argument('--kernel-sizes', dest='kernel_sizes', nargs=3)
    # parser.add_argument('--fc-nodes', dest='fc_nodes', nargs=2)

    logging.basicConfig(level=logging.INFO)
    args = parser.parse_args()
    args = sanitize(args)
    main(args)
