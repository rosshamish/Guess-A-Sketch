import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__),'../../'))

from utils.base_model import Model
from utils.tf_graph_scope import define_scope
import tensorflow as tf

conv2d = tf.nn.conv2d
max_pool = tf.nn.max_pool
relu = tf.nn.relu
slim = tf.contrib.slim

class SketchCNN(Model):
    """
    Summary
    ---
    Three convolutional max pooling layers, then two fully-connected dropout layers.
    Confidences are computed by a fully-connected dropout layer with `num_labels` outputs.
    Loss is calculated by softmax cross entropy vs the one-hot label vector.
    Accuracy is calculated as the confidence of the correct label.

    Prediction Architecture
    ---
    0. Reshaping
    1. Convolutional max-pooling
        - 3 layers
        - each is a 2-D convolution, followed by a max-pool
        - this convolves the image's pixels, then fans them out into a feature array
        - 1st layer has a small feature array
        - 2nd is larger
        - 3rd is the largest
    2. Fully-connected dropout
        - double decker sandwich, FC-D-FC-D-FC
        - last FC layer outputs array of shape (`num_labels`), one value per label
        - other FC layers output large feature arrays
        - dropout is used to prevent co-evolution during training.
        - dropout's `keep_prob` should be 1.0 for evaluation.

    Optimization / Learning:
    - minimize the loss using tf's AdamOptimizer
    """
    _NAME = 'SketchCNN'

    def __init__(self, *args, **kwargs):
        # For holding a reference to tensors to pass around
        # Used instead of passing an input tensor argument because of @define_scope behavior.
        self._conv_pools_in = None
        self._fc_dropout_in = None

        # Initialize prediction, train, accuracy, Tensors / subgraphs
        # Also set some properties
        super(SketchCNN, self).__init__(*args, **kwargs)

        # Magic statement. Initialize this Tensor / subgraph, to cache for later.
        self._loss
        self._conv_pools
        self._fc_dropout

    @define_scope
    def prediction(self):
        self._conv_pools_in = tf.reshape(self.images_tensor, [-1, self.width, self.height, 1])
        self._fc_dropout_in = self._conv_pools
        y = self._fc_dropout
        return y

    @define_scope
    def train(self):
        # tf.summary.scalar('cross_entropy', cross_entropy)
        return tf.train.AdamOptimizer(1e-4).minimize(self._loss)

    @define_scope
    def _loss(self):
        measure = tf.nn.softmax_cross_entropy_with_logits(
            labels=self.labels_tensor,
            logits=self.prediction)
        return tf.reduce_mean(measure)

    @define_scope
    def _conv_pools(self):
        filter_1 = 64
        filter_2 = 128
        filter_3 = 256

        # Layer 1, 64 features
        h_conv1 = slim.conv2d(self._conv_pools_in, filter_1, kernel_size=15, stride=3, padding='VALID')
        h_pool1 = slim.max_pool2d(h_conv1, stride=2, kernel_size=[3, 3])

        # Layer 2, 128 features
        h_conv2 = slim.conv2d(h_pool1, filter_2, kernel_size=5, stride=1, padding='VALID')
        h_pool2 = slim.max_pool2d(h_conv2, stride=2, kernel_size=[3, 3])

        # Layer 3, three convs with 256 features
        h_conv3 = slim.conv2d(h_pool2, filter_3, kernel_size=3, stride=1)
        h_conv4 = slim.conv2d(h_conv3, filter_3, kernel_size=3, stride=1)
        h_conv5 = slim.conv2d(h_conv4, filter_3, kernel_size=3, stride=1)
        h_pool5 = slim.max_pool2d(h_conv5, stride=2, kernel_size=3, padding='VALID')

        return tf.reshape(h_pool5, [-1, 7 * 7 * filter_3])

    @define_scope
    def _fc_dropout(self):
        filter_fc = 512

        h_fc1 = slim.fully_connected(self._fc_dropout_in, filter_fc)
        h_fc1_drop = tf.nn.dropout(h_fc1, self.keep_prob_tensor)
        h_fc2 = slim.fully_connected(h_fc1_drop, filter_fc)
        h_fc2_drop = tf.nn.dropout(h_fc2, self.keep_prob_tensor)
        return slim.fully_connected(h_fc2_drop, self.num_labels)

    @define_scope
    def accuracy(self):
        correct_confidence = tf.multiply(self.prediction, self.labels_tensor)
        max_confidence = tf.reduce_max(self.prediction)
        normalized_correct_confidence = tf.divide(self.prediction, max_confidence)
        return tf.reduce_mean(tf.cast(normalized_correct_confidence, tf.float32))
