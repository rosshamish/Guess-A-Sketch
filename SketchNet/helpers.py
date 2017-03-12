
# coding: utf-8

# In[2]:

import numpy as np
import os
import random
import scipy
import tensorflow as tf
from PIL import Image


# In[3]:

# Helper Functions 

def weight_variable(shape):
  initial = tf.truncated_normal(shape, stddev=0.1)
  return tf.Variable(initial)

def bias_variable(shape):
  initial = tf.constant(0.1, shape=shape)
  return tf.Variable(initial)

def conv2d(x, W):
  return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')

def max_pool_2x2(x):
  return tf.nn.max_pool(x, ksize=[1, 2, 2, 1],
                        strides=[1, 2, 2, 1], padding='SAME')


# In[4]:

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
    random.shuffle(indicies)
    
    for i in indicies[:batch_size]:
        path, ground_truth = truth_mapping[i]
        X.append(np.ndarray.flatten(scipy.misc.imresize(np.array(Image.open(path)), (500, 500))))
        truth.append(ground_truth)
        
        random.shuffle(indicies) # reshuffle 
        
    return X, truth





