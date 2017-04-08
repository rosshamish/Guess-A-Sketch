import random
import os

import numpy as np
import scipy.misc
from PIL import Image

from sklearn.model_selection import KFold

import logging
log = logging.getLogger(__name__)

def get_classes(folder):
    return [x[0].split('/')[-1] for x in os.walk(folder)][1:]


def read_and_flatten(class_dir, ground_truth):
    fnames = [(os.path.join(class_dir, f), ground_truth)
              for f in os.listdir(class_dir)
              if os.path.isfile(os.path.join(class_dir, f)) and f.endswith('.png')]
    return fnames


def reload_K_splits(dir, split_within_labels=False, labels=None):
    """ 
    Return two lists: a training set, and a test set.

    Lists look like
        [('path/to/random/label/0/sketch.png', 0),('path/to/random/label/1/sketch.png', 1)]

    split_within_labels:
        when True,
            most cats are training, and few cats are test. All labels are in both.
        when False,
            either all cats are training, or all cats are test. A label is in one or the other.
    """
    KF = KFold(n_splits=10, shuffle=True)
    train_set, test_set = [], []
    if split_within_labels:
        filenames_by_label = preprocess(dir, by_label=split_within_labels, labels=labels)
        assert len(filenames_by_label) == len(labels)
        assert len(filenames_by_label[0])
        assert len(filenames_by_label[0][0]) == 2
        for in_one_label in filenames_by_label:
            train_idx, test_idx = KF.split(in_one_label).next()
            train_set.extend(in_one_label[x] for x in train_idx)
            test_set.extend(in_one_label[x] for x in test_idx)
    else:
        all_imgs = preprocess(dir)
        train_idx, test_idx = KF.split(all_imgs).next()
        train_set = [all_imgs[x] for x in train_idx]
        test_set = [all_imgs[x] for x in test_idx]
    assert len(train_set), len(test_set)
    assert len(train_set[0]) == 2, len(test_set[0]) == 2
    return train_set, test_set

def preprocess(directory, by_label=False, labels=None):
    """
    Returns: list of tuples: (filename, ground truth)

    by_label: boolean
        - when True, returns a 2-tier list that looks like:
            example_definitions = preprocess(...)
            example_definitions[label_index][0] === ('../relative/path/to/cat/0001.png', 42)
          where 42 is the label index, either from `labels` or from all labels in the directory
        - when False, returns the same, but flattened.
    labels: list of strings
        - filter the dataset to a subset of labels
    """
    if labels is None:
        labels = get_classes(directory)

    filenames_and_label_indexes = [
        read_and_flatten(os.path.join(directory, label), label_index)
        for label_index, label in enumerate(labels)
    ]
    assert len(filenames_and_label_indexes)
    assert len(filenames_and_label_indexes[0])
    assert len(filenames_and_label_indexes[0][0]) == 2
    if by_label:
        return filenames_and_label_indexes
    else:
        # Attribution: flatten a numpy array, except the last dimension
        # URL: http://stackoverflow.com/a/18758049
        # Accessed: April 7, 2017
        nparr = np.array(filenames_and_label_indexes)
        return nparr.reshape(-1, nparr.shape[-1]).tolist()

def getExampleByLabel(args):
    dims, num_labels, from_set = args
    try:
        imgPath, index = random.choice(from_set)
        truth = np.zeros(num_labels)
        truth[index] = 1
        return scipy.misc.imresize(np.array(Image.open(imgPath)), dims), truth
    except Exception as e:
        log.error(e)
        raise

#TRAIN_FILENAMES, TEST_FILENAMES = reload_K_splits('/home/ubuntu/png')

#TRAIN_FILENAMES, TEST_FILENAMES = reload_K_splits('/Users/anjueappen/png')

#TRAIN_FILENAMES, TEST_FILENAMES = reload_K_splits('./png')
def getExample(args):
    dims, train, num_labels = args
    try:
        imgPath, index = random.choice(TRAIN_FILENAMES if train else TEST_FILENAMES)
        index = int(index)
        truth = np.zeros(num_labels)
        truth[index] = 1
        return scipy.misc.imresize(np.array(Image.open(imgPath)), dims), truth
    except Exception as e:
        log.error(e)
        raise

def get_batch_by_label(batch_size, dims, num_labels, from_set):
    """
    from_set:
        either the training or test set returned from reload_K_splits()
    """
    from multiprocessing.dummy import Pool as ThreadPool
    pool = ThreadPool()
    args = [(dims, num_labels, from_set)] * batch_size
    assert len(args) == batch_size
    results = pool.map(getExampleByLabel, args)
    pool.close()
    pool.join()
    pool.terminate()
    imgs, truths = zip(*results)
    return np.array(imgs), np.array(truths)

def get_batch(batch_size, dims, train=True, num_labels=None):
    if num_labels is None:
        raise ValueError('you need that')
    from multiprocessing.dummy import Pool as ThreadPool
    pool = ThreadPool()
    results = pool.map(getExample, [(dims, train, num_labels)] * batch_size)
    pool.close()
    pool.join()
    pool.terminate()
    imgs, truths = zip(*results)
    return np.array(imgs), np.array(truths)
