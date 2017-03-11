
# coding: utf-8

# In[2]:

import os
import numpy as np
import tensorflow as tf
from numpy.lib.stride_tricks import as_strided
from scipy.signal import convolve2d
import scipy
import multiprocessing
import random

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

# preprocess('/Users/anjueappen/Downloads/png')


# In[5]:

# def net(width, height, train=False):
#     graph = tf.Graph()
#     with graph.as_default():

train = True
width = 500
height = 500
num_labels = 250

x = tf.placeholder(tf.float32, [None, width*height])
y_ = tf.placeholder(tf.float32, [None, num_labels])
keep_prob = tf.placeholder(tf.float32)

filter_1 = 32
filter_2 = 64
filter_3 = 1024

# Layer 1
W_conv1 = weight_variable([5, 5, 1, filter_1])
b_conv1 = bias_variable([filter_1])

x_image = tf.reshape(x, [-1,width,height,1])

h_conv1 = tf.nn.relu(conv2d(x_image, W_conv1) + b_conv1)
h_pool1 = max_pool_2x2(h_conv1)

# Layer 2

W_conv2 = weight_variable([5, 5, filter_1, filter_2])
b_conv2 = bias_variable([filter_2])

h_conv2 = tf.nn.relu(conv2d(h_pool1, W_conv2) + b_conv2)
h_pool2 = max_pool_2x2(h_conv2)


# Layer 3 - Densely Connected 

W_fc1 = weight_variable([125 * 125 * filter_2, filter_3])
b_fc1 = bias_variable([filter_3])

h_pool2_flat = tf.reshape(h_pool2, [-1, 125*125*filter_2])
h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

# Dropout Layer 

h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

# Readout Layer - classify the images
W_fc2 = weight_variable([filter_3, num_labels])
b_fc2 = bias_variable([num_labels])

y_conv = tf.matmul(h_fc1_drop, W_fc2) + b_fc2
        
# Training Steps -- if we are training, add training steps to graph
if train: 
    cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y_conv))
    train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)
        
# Make Prediction
correct_prediction = tf.equal(tf.argmax(y_conv,1), tf.argmax(y_,1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
        
#     return graph 


# In[6]:

# Training and Evaluation - where the magic happens :) 

# DATA_PATH = '/Users/anjueappen/Downloads/png'

# from data_prep import preprocess, create_batch 
from sklearn.model_selection import KFold

# TODO: Recreate separate sessions for training and testing 
with tf.Session() as sess:
    init = tf.global_variables_initializer()
    sess.run(init)
    
    ground_truth_mapping = preprocess('/Users/anjueappen/Downloads/png')
    index = list(range(len(ground_truth_mapping)))

    for i in range(1000):
        print(i)
        batch = create_batch(ground_truth_mapping, index, 50)
        train_step.run(feed_dict={x: np.array(batch[0]), y_: np.array(batch[1]), keep_prob: 0.5})

        if i%100 == 0:
            train_accuracy = accuracy.eval(feed_dict={x:batch[0], y_: batch[1], keep_prob: 1.0})
            print("step %d, training accuracy %g"%(i, train_accuracy))
        
    batch = create_batch(ground_truth_mapping, index, 50)
    print("test accuracy %g" % accuracy.eval(feed_dict={x: np.array(batch[0]), y_: np.array(batch[1]), keep_prob: 1.0}))


# In[ ]:

"""Scrap Code 
kf = KFold(n_splits=10, shuffle=True) # Hard coded 'k=10'
for train_index, test_index in kf.split(list(ground_truth_mapping.items()):
    

"""


# In[ ]:



