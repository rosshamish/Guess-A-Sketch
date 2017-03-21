import multiprocessing
import random
import itertools
import os

import numpy as np
import scipy.misc
from PIL import Image


def get_classes(folder):
    return [x[0].split('/')[-1] for x in os.walk(folder)][1:]


def read_and_flatten(class_dir, ground_truth):
    fnames = [(os.path.join(class_dir, f), ground_truth)
              for f in os.listdir(class_dir)
              if os.path.isfile(os.path.join(class_dir, f)) and f.endswith('.png')]
    return fnames


def preprocess(directory):
    """
    Returns: list of tuples: (filename, ground truth)
    """
    classes = get_classes(directory)
    num_classes = len(classes)

    imgs = []
    for i in range(num_classes):
        imgs += read_and_flatten(directory + '/' + classes[i], i)
    return imgs



FILENAMES = preprocess('/Users/anjueappen/png')


def getExample(dims):
    try:
        imgPath, index = random.choice(FILENAMES)
        truth = np.zeros(250)
        truth[index] = 1
        return scipy.misc.imresize(np.array(Image.open(imgPath)), dims), truth

    except Exception as e:
        print e
        return getExample()




def get_batch(batch_size, dims):
    from multiprocessing.dummy import Pool as ThreadPool
    pool = ThreadPool()
    results = pool.map(getExample, [dims] * batch_size)
    imgs, truths = zip(*results)
    return np.array(imgs), np.array(truths)