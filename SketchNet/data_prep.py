
# coding: utf-8

# In[18]:

import os
import numpy as np
import tensorflow as tf
from numpy.lib.stride_tricks import as_strided
from scipy.signal import convolve2d
import multiprocessing
import random

from PIL import Image


# Image Preprocessing: 
# 1. Get class labels (aka directory names)
# 2. Create template vector by length of number of classes --> ground truth/label vector 
# 3. Read each image from classes and flatten, append ground truth vector to image
#     - Note down where the ground truth vector starts/resize foreign images to same as existing dataset
# 4. Aggregate all images and split into K groups (if not equally divisible, throw error)
# 5. def get_batch(batch_size): return a random batch from K-1 groups
# 
# Parameters from net: 
# (1) batch size 
# (2) data directory (therefore image dimensions/ground truth length etc.)

# In[27]:

def get_classes(folder):
    return [x[0].split('/')[-1] for x in os.walk(folder)][1:]


def read_and_flatten(class_dir, ground_truth):
    fnames = [(os.path.join(class_dir, f), ground_truth) 
              for f in os.listdir(class_dir) 
              if os.path.isfile(os.path.join(class_dir, f))]
    return fnames

def preprocess(directory):
    """
    Returns: list of tuples: (filename, ground truth)
    """
    classes = get_classes(directory)
    num_classes = len(classes)
    
    imgs = []
    #multiprocess this loop? 
    for i in range(num_classes):
        ground_truth = np.zeros(num_classes)
        ground_truth[i] = 1 # set label for this 
        
        imgs += read_and_flatten(directory +'/'+ classes[i], ground_truth)
    return imgs

def create_batch(truth_mapping, indicies, batch_size):
    """
    truth_mapping: list of tuples: (filepath, truth_vector)
    indicies: list of indicies we can use in batch 
    batch_size: how many images to use in batch 
    """
    if len(truth_mapping) < batch_size: 
        raise Exception('Not enough images to create batch!'); 
    
    X = []
    truth = []
    import pdb; pdb.set_trace()
    print(indicies)
    random.shuffle(indicies)
    
    for i in indicies[:batch_size]:
        path, ground_truth = truth_mapping[i]
        X.append(np.ndarray.flatten(np.array(Image.open(path))))
        truth.append(ground_truth)
        
        random.shuffle(indicies) # reshuffle 
        
    return X, truth

# preprocess('/Users/anjueappen/Downloads/png')


# In[14]:

# # for each image, we want to create some time for
# from sklearn.model_selection import KFold
# def partition_data(items, k):
#     kf = KFold(n_splits=k, shuffle=True)
#     for train_index, test_index in kf.split(items):
#             print(len(create_batch(items[train_index], 10)))

# partition_data(list(ground_truth_mapping.items()), 10)


# In[ ]:



