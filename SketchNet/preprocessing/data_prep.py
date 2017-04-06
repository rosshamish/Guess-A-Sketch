import random
import os

import numpy as np
import scipy.misc
from PIL import Image

from sklearn.model_selection import KFold

KF = KFold(n_splits=10, shuffle=True)


def get_classes(folder):
    return [x[0].split('/')[-1] for x in os.walk(folder)][1:]


def read_and_flatten(class_dir, ground_truth):
    fnames = [(os.path.join(class_dir, f), ground_truth)
              for f in os.listdir(class_dir)
              if os.path.isfile(os.path.join(class_dir, f)) and f.endswith('.png')]
    return fnames


def reload_K_splits(dir):
    all_imgs = preprocess(dir)
    train_idx, test_idx = KF.split(all_imgs).next()
    return [all_imgs[x] for x in train_idx], [all_imgs[x] for x in test_idx]


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

# #TRAIN_FILENAMES, TEST_FILENAMES = reload_K_splits('/home/ubuntu/png')
# TRAIN_FILENAMES, TEST_FILENAMES = reload_K_splits('./png')
# #TRAIN_FILENAMES, TEST_FILENAMES = reload_K_splits('/Users/anjueappen/png')

def getExample(args):
    dims, train = args
    try:
        imgPath, index = random.choice(TRAIN_FILENAMES if train else TEST_FILENAMES)
        truth = np.zeros(250)
        truth[index] = 1
        return scipy.misc.imresize(np.array(Image.open(imgPath)), dims), truth

    except Exception as e:
        print e
        return getExample()


def get_batch(batch_size, dims, train=True):
    from multiprocessing.dummy import Pool as ThreadPool
    pool = ThreadPool()
    results = pool.map(getExample, [(dims, train)] * batch_size)
    pool.close()
    pool.join()
    pool.terminate()
    imgs, truths = zip(*results)
    return np.array(imgs), np.array(truths)
