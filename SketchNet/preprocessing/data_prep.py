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


def reload_K_splits(dir, split_within_labels=False):
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
    if split_within_labels:
        filenames_by_label = preprocess(dir, by_label=split_within_labels)
        assert len(filenames_by_label) == 250
        assert len(filenames_by_label[0]) == 2
        train_set, test_set = [], []
        for label_i, filenames in enumerate(filenames_by_label):
            training_filenames, test_filenames = KF.split(filenames).next()
            train_set += [(f, label_i) for f in training_filenames]
            test_set += [(f, label_i) for f in test_filenames]
        return train_set, test_set
    else:
        imgs = preprocess(dir)
        train_idx, test_idx = KF.split(imgs).next()
        return [all_imgs[x] for x in train_idx], [all_imgs[x] for x in test_idx]

def preprocess(directory, by_label=False):
    """
    Returns: list of tuples: (filename, ground truth)
    """
    classes = get_classes(directory)
    num_classes = len(classes)

    filenames = []
    for i in range(num_classes):
        class_filenames = read_and_flatten(os.path.join(directory, classes[i], i))
        if by_label:
            filenames.append(class_filenames)
        else:
            filenames.extend(class_filenames)
    if by_label:
        return filenames
    else:
        return zip(filenames, ground_truths)

def getExampleByLabel(args):
    dims, num_labels, from_set = args
    try:
        imgPath, label_num = random.choice(from_set)
        truth = np.zeros(num_labels)
        truth[label_num] = 1
        return scipy.misc.imresize(np.array(Image.open(imgPath)), dims), truth
    except Exception as e:
        log.error(e)
        raise

#TRAIN_FILENAMES, TEST_FILENAMES = reload_K_splits('/home/ubuntu/png')

#TRAIN_FILENAMES, TEST_FILENAMES = reload_K_splits('/Users/anjueappen/png')

TRAIN_FILENAMES, TEST_FILENAMES = reload_K_splits('./png')
def getExample(args):
    dims, train, labels = args
    try:
        imgPath, index = random.choice(TRAIN_FILENAMES if train else TEST_FILENAMES)
        truth = np.zeros(250)
        truth[index] = 1
        return 
    except Exception as e:
        print e
        return getExample()

def get_batch_by_label(batch_size, dims, num_labels, from_set):
    """
    from_set:
        either the training or test set returned from reload_K_splits()
    """
    from multiprocessing.dummy import Pool as ThreadPool
    pool = ThreadPool()
    results = pool.map(getExampleByLabel, [(dims, num_labels, from_set)] * batch_size)
    pool.close()
    pool.join()
    pool.terminate()
    imgs, truths = zip(*results)
    return np.array(imgs), np.array(truths)

def get_batch(batch_size, dims, train=True, by_label=False, num_labels, labels=None):
    from multiprocessing.dummy import Pool as ThreadPool
    pool = ThreadPool()
    results = pool.map(getExample, [(dims, train, labels)] * batch_size)
    pool.close()
    pool.join()
    pool.terminate()
    imgs, truths = zip(*results)
    return np.array(imgs), np.array(truths)
