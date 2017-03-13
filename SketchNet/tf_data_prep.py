
# coding: utf-8

# In[1]:

import tensorflow as tf
from PIL import Image
import numpy as np


# In[2]:

def get_classes(folder):
    return [x[0].split('/')[-1] for x in os.walk(folder)][1:]


def read_and_flatten(class_dir, ground_truth):
    fnames = [(os.path.join(class_dir, f), ground_truth) 
              for f in os.listdir(class_dir) 
              if os.path.isfile(os.path.join(class_dir, f))]
    return fnames

def preprocess(directory):
    """
    Returns: dict of tuples: (filename: ground truth index)
    """
    classes = get_classes(directory)
    num_classes = len(classes)
    
    imgs = {}
    for i in range(num_classes):
        imgs.update(read_and_flatten(directory +'/'+ classes[i], i))
    return imgs


# In[3]:

import functools
def doublewrap(function):
    """
    A decorator decorator, allowing to use the decorator to be used without
    parentheses if not arguments are provided. All arguments must be optional.
    """

    @functools.wraps(function)
    def decorator(*args, **kwargs):
        if len(args) == 1 and len(kwargs) == 0 and callable(args[0]):
            return function(args[0])
        else:
            return lambda wrapee: function(wrapee, *args, **kwargs)

    return decorator


@doublewrap
def define_scope(function, scope=None, *args, **kwargs):
    """
    A decorator for functions that define TensorFlow operations. The wrapped
    function will only be executed once. Subsequent calls to it will directly
    return the result so that operations are added to the graph only once.
    The operations added by the function live within a tf.variable_scope(). If
    this decorator is used with arguments, they will be forwarded to the
    variable scope. The scope name defaults to the name of the wrapped
    function.
    """
    attribute = '_cache_' + function.__name__
    name = scope or function.__name__
    @property
    @functools.wraps(function)
    def decorator(self):
        if not hasattr(self, attribute):
            with tf.variable_scope(name, *args, **kwargs):
                setattr(self, attribute, function(self))
        return getattr(self, attribute)

    return decorator

    # Helper Functions


# In[6]:

import tensorflow as tf
from PIL import Image
import numpy as np

def get_batch(filepaths):
    filename_queue = tf.train.string_input_producer(filepaths) #  list of files to read

    reader = tf.WholeFileReader()
    _, image_file = reader.read(filename_queue)

    my_img = tf.image.decode_png(image_file) # use png or jpg decoder based on your files.

    # Generate ground truth label vector for this image
    truth = tf.one_hot(8, depth = 250, 
                               on_value=1.0, off_value=0.0, axis=-1)

    init_op = tf.global_variables_initializer()
    with tf.Session() as sess:
        sess.run(init_op)

        # Start populating the filename queue.

        coord = tf.train.Coordinator()
        threads = tf.train.start_queue_runners(coord=coord)

        loader = Loader(250, 8)
        image, truth = sess.run([my_img, truth]) #here is your image Tensor :) 

        print(image.shape)
        print(truth)
    #     Image.fromarray(np.asarray(image)).show()

        coord.request_stop()
        coord.join(threads)

filepaths =['/Users/anjueappen/png/axe/649.png', '/Users/anjueappen/png/axe/650.png']
get_batch(filepaths)


# In[ ]:



