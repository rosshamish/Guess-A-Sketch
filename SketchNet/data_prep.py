
# coding: utf-8

# In[ ]:

import os
import numpy as np
import tensorflow as tf
from numpy.lib.stride_tricks import as_strided
from scipy.signal import convolve2d

from PIL import Image

# In[ ]:

DATA_PATH = '/Users/anjueappen/Downloads/png'
def get_classes(folder):
    return [x[0].split('/')[-1] for x in os.walk(folder)][1:]

classes = get_classes(DATA_PATH)
print(len(classes))
print(classes)

"""
Image Preprocessing: 
1. Get class labels (aka directory names)
2. Create template vector by length of number of classes --> ground truth/label vector 
3. Read each image from classes and flatten, append ground truth vector to image
    - Note down where the ground truth vector starts/resize foreign images to same as existing dataset
4. Aggregate all images and split into K groups (if not equally divisible, throw error)
5. def get_batch(batch_size): return a random batch from K-1 groups

Parameters from net: 
(1) batch size 
(2) data directory (therefore image dimensions/ground truth length etc.)
"""

def read_and_flatten(class_dir, ground_truth):
    fnames = [f for f in os.listdir(class_dir) if os.path.isfile(os.path.join(class_dir, f))]
#     images = [np.append(np.ndarray.flatten(np.array(Image.open(os.path.join(class_dir, f)))), ground_truth) 
#               for f in fnames]
    
    images = dict([(os.path.join(class_dir, f), ground_truth) 
              for f in fnames])
    return images

def preprocess(directory):
    classes = get_classes(DATA_PATH)
    num_classes = len(classes)
    ground_truth_template = np.zeros(num_classes)
    
    imgs = []
    for i in range(num_classes):
        ground_truth = ground_truth_template
        ground_truth[i] = 1 # set label for this 
        
        imgs.extend(read_and_flatten(DATA_PATH +'/'+ classes[i], ground_truth))
    return imgs

print(len(preprocess(DATA_PATH)))
    


# In[ ]:

# for each image, we want to create some time for

