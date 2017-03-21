import tensorflow as tf
import functools
from helpers import create_batch, preprocess
import numpy as np


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


class EX1_Model:
    def __init__(self, image, width, height, num_labels, label, keep_prob):

        self.image = image
        self.label = label
        self.keep_prob = keep_prob
        self.width = width
        self.height = height
        self.num_labels = num_labels

        self.prediction
        self.train
        self.accuracy

    @define_scope
    def prediction(self):
        filter_1 = 32
        filter_2 = 64
        filter_3 = 1024

        # Layer 1
        W_conv1 = weight_variable([5, 5, 1, filter_1])
        b_conv1 = bias_variable([filter_1])

        x_image = tf.reshape(self.image, [-1, self.width, self.height, 1]) #TODO: probably removable

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

        h_pool2_flat = tf.reshape(h_pool2, [-1, 125 * 125 * filter_2])
        h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

        # Dropout Layer

        h_fc1_drop = tf.nn.dropout(h_fc1, self.keep_prob)

        # Readout Layer - classify the images
        W_fc2 = weight_variable([filter_3, self.num_labels])
        b_fc2 = bias_variable([self.num_labels])

        y_conv = tf.matmul(h_fc1_drop, W_fc2) + b_fc2
        return y_conv

    @define_scope
    def train(self):
        cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=self.label, logits=self.prediction))
        return tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)

    @define_scope
    def accuracy(self):
        correct_prediction = tf.equal(tf.argmax(self.label, 1), tf.argmax(self.prediction, 1))
        accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
        return accuracy

from tf_data_prep import populate_batch

def main():
    # TODO Hard Coding!!!
    train = True
    width = 500
    height = 500
    num_labels = 250

    image = tf.placeholder(tf.float32, [None, width,  height, 1])
    label = tf.placeholder(tf.float32, [None, num_labels])
    keep_prob = tf.placeholder(tf.float32)

    model = EX1_Model(image, width, height, num_labels, label, keep_prob)

    with tf.Session() as sess:
        init = tf.global_variables_initializer()
        sess.run(init)

        ground_truth_mapping = preprocess('/Users/anjueappen/png')

        for i in range(1000):
            print(i)
            batch = populate_batch(ground_truth_mapping[:50], (height, width))
            sess.run(model.train, {image: batch[0], label:batch[1], keep_prob: 0.5})

            if i % 100 == 0:
                train_accuracy = sess.run(model.accuracy, {image: batch[0], label: batch[1], keep_prob: 1.0})
                print("step %d, training accuracy %g" % (i, train_accuracy))

            import random; random.shuffle(ground_truth_mapping)

        batch = populate_batch(ground_truth_mapping[:50], (height, width))
        acc = sess.run(model.accuracy, {image: batch[0], label: batch[1], keep_prob: 1.0})
        print("test accuracy %g" % acc)


if __name__ == '__main__':
    main()
