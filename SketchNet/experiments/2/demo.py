# Copyright 2015 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
"""A simple MNIST classifier which displays summaries in TensorBoard.

This is an unimpressive MNIST model, but it is a good example of using
tf.name_scope to make a graph legible in the TensorBoard graph explorer, and of
naming summary tags so that they are grouped meaningfully in TensorBoard.

It demonstrates the functionality of every TensorBoard dashboard.
"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import sys, os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))

import argparse
import sys

import tensorflow as tf

from tensorflow.examples.tutorials.mnist import input_data
from preprocessing.data_prep import get_batch

FLAGS = None


def train():
    # # Import data
    # mnist = input_data.read_data_sets(FLAGS.data_dir,
    #                                   one_hot=True,
    #                                   fake_data=FLAGS.fake_data)

    sess = tf.InteractiveSession()
    # Create a multilayer model.

    slim = tf.contrib.slim

    width = 225
    height = 225
    num_labels = 250
    batch_size = 135

    filter_1 = 64
    filter_2 = 128
    filter_3 = 256
    filter_4 = 512

    # Input placeholders
    with tf.name_scope('Input'):
        image = tf.placeholder(tf.float32, [None, width, height], name='input-img')
        label = tf.placeholder(tf.float32, [None, num_labels], name='ground-truth-label')
        keep_prob = tf.placeholder(tf.float32, name='keep-prob')

    with tf.name_scope('ReshapedInput'):
        x_image = tf.reshape(image, [-1, width, height, 1])

    with tf.name_scope('ConvPoolingLayer1'):
        h_conv1 = slim.conv2d(x_image, filter_1, kernel_size=15, stride=3, padding='VALID')
        h_pool1 = slim.max_pool2d(h_conv1, stride=2, kernel_size=[3, 3])

    with tf.name_scope('ConvPoolingLayer2'):
        h_conv2 = slim.conv2d(h_pool1, filter_2, kernel_size=5, stride=1, padding='VALID')
        h_pool2 = slim.max_pool2d(h_conv2, stride=2, kernel_size=[3, 3])

    with tf.name_scope('ConvPoolingLayer3'):
        h_conv3 = slim.conv2d(h_pool2, filter_3, kernel_size=3, stride=1)
        h_conv4 = slim.conv2d(h_conv3, filter_3, kernel_size=3, stride=1)
        h_conv5 = slim.conv2d(h_conv4, filter_3, kernel_size=3, stride=1)
        h_pool5 = slim.max_pool2d(h_conv5, stride=2, kernel_size=3, padding='VALID')

    with tf.name_scope('FlattenedConvOutput'):
        h_pool5_flat = tf.reshape(h_pool5, [-1, 7 * 7 * filter_3])

    with tf.name_scope('FCDropoutLayer1'):
        h_fc1 = slim.fully_connected(h_pool5_flat, filter_4)
        h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

    with tf.name_scope('FCDropoutLayer2'):
        h_fc2 = slim.fully_connected(h_fc1_drop, filter_4)
        h_fc2_drop = tf.nn.dropout(h_fc2, keep_prob)

    with tf.name_scope('FCPredictionLayer'):
        prediction = slim.fully_connected(h_fc2_drop, num_labels)

    with tf.name_scope('CrossEntropyLoss'):
        cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=label, logits=prediction))

    with tf.name_scope('TrainingStep'):
        train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)

    with tf.name_scope('Accuracy'):
        with tf.name_scope('CorrectPrediction'):
            correct_prediction = tf.equal(tf.argmax(label, 1), tf.argmax(prediction, 1))
        accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

    tf.summary.scalar('Accuracy vs Iterations', accuracy)
    tf.summary.scalar('Cross Entropy Loss vs Iterations', cross_entropy)


    # We can't initialize these variables to 0 - the network will get stuck.
    def weight_variable(shape):
        """Create a weight variable with appropriate initialization."""
        initial = tf.truncated_normal(shape, stddev=0.1)
        return tf.Variable(initial)

    def bias_variable(shape):
        """Create a bias variable with appropriate initialization."""
        initial = tf.constant(0.1, shape=shape)
        return tf.Variable(initial)

    def variable_summaries(var):
        """Attach a lot of summaries to a Tensor (for TensorBoard visualization)."""
        with tf.name_scope('summaries'):
            mean = tf.reduce_mean(var)
            tf.summary.scalar('mean', mean)
            with tf.name_scope('stddev'):
                stddev = tf.sqrt(tf.reduce_mean(tf.square(var - mean)))
            tf.summary.scalar('stddev', stddev)
            tf.summary.scalar('max', tf.reduce_max(var))
            tf.summary.scalar('min', tf.reduce_min(var))
            tf.summary.histogram('histogram', var)

    def nn_layer(input_tensor, input_dim, output_dim, layer_name, act=tf.nn.relu):
        """Reusable code for making a simple neural net layer.

    It does a matrix multiply, bias add, and then uses ReLU to nonlinearize.
    It also sets up name scoping so that the resultant graph is easy to read,
    and adds a number of summary ops.
    """
        # Adding a name scope ensures logical grouping of the layers in the graph.
        with tf.name_scope(layer_name):
            # This Variable will hold the state of the weights for the layer
            with tf.name_scope('weights'):
                weights = weight_variable([input_dim, output_dim])
                variable_summaries(weights)
            with tf.name_scope('biases'):
                biases = bias_variable([output_dim])
                variable_summaries(biases)
            with tf.name_scope('Wx_plus_b'):
                preactivate = tf.matmul(input_tensor, weights) + biases
                tf.summary.histogram('pre_activations', preactivate)
            activations = act(preactivate, name='activation')
            tf.summary.histogram('activations', activations)
            return activations

    # hidden1 = nn_layer(x, 784, 500, 'layer1')
    #
    # with tf.name_scope('dropout'):
    #   keep_prob = tf.placeholder(tf.float32)
    #   tf.summary.scalar('dropout_keep_probability', keep_prob)
    #   dropped = tf.nn.dropout(hidden1, keep_prob)

    # Do not apply softmax activation yet, see below.
    # y = nn_layer(dropped, 500, 10, 'layer2', act=tf.identity)

    # with tf.name_scope('cross_entropy'):
    #   # The raw formulation of cross-entropy,
    #   #
    #   # tf.reduce_mean(-tf.reduce_sum(y_ * tf.log(tf.softmax(y)),
    #   #                               reduction_indices=[1]))
    #   #
    #   # can be numerically unstable.
    #   #
    #   # So here we use tf.nn.softmax_cross_entropy_with_logits on the
    #   # raw outputs of the nn_layer above, and then average across
    #   # the batch.
    #   diff = tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y)
    #   with tf.name_scope('total'):
    #     cross_entropy = tf.reduce_mean(diff)
    # tf.summary.scalar('cross_entropy', cross_entropy)
    #
    # with tf.name_scope('train'):
    #   train_step = tf.train.AdamOptimizer(FLAGS.learning_rate).minimize(
    #       cross_entropy)
    #
    # with tf.name_scope('accuracy'):
    #   with tf.name_scope('correct_prediction'):
    #     correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
    #   with tf.name_scope('accuracy'):
    #     accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
    # tf.summary.scalar('accuracy', accuracy)

    # Merge all the summaries and write them out to /tmp/tensorflow/mnist/logs/mnist_with_summaries (by default)
    merged = tf.summary.merge_all()
    LD = '/tmp/demo/exp1'
    train_writer = tf.summary.FileWriter(LD + '/train', sess.graph)
    test_writer = tf.summary.FileWriter(LD + '/test')
    tf.global_variables_initializer().run()

    # Train the model, and also write summaries.
    # Every 10th step, measure test-set accuracy, and write test summaries
    # All other steps, run train_step on training data, & add training summaries

    def feed_dict(train):
        """Make a TensorFlow feed_dict: maps data onto Tensor placeholders."""
        if train:
            batch = get_batch(batch_size, (height, width))
            k = 0.5
        else:
            batch = get_batch(batch_size, (height, width), train=False)
            k = 1.0
        return {image: batch[0], label: batch[1], keep_prob: k}

    from tqdm import tqdm
    for i in tqdm(range(1)):
        if i % 10 == 0:  # Record summaries and test-set accuracy
            summary, acc = sess.run([merged, accuracy], feed_dict=feed_dict(False))
            test_writer.add_summary(summary, i)
            print('Accuracy at step %s: %s' % (i, acc))
        else:  # Record train set summaries, and train
            if i % 100 == 99:  # Record execution stats
                run_options = tf.RunOptions(trace_level=tf.RunOptions.FULL_TRACE)
                run_metadata = tf.RunMetadata()
                summary, _ = sess.run([merged, train_step],
                                      feed_dict=feed_dict(True),
                                      options=run_options,
                                      run_metadata=run_metadata)
                train_writer.add_run_metadata(run_metadata, 'step%03d' % i)
                train_writer.add_summary(summary, i)
                print('Adding run metadata for', i)
            else:  # Record a summary
                summary, _ = sess.run([merged, train_step], feed_dict=feed_dict(True))
                train_writer.add_summary(summary, i)

    train_writer.close()
    test_writer.close()


train()
