import sys, os
import tensorflow as tf

class SketchCNNSlim(object):
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
    _NAME = 'SketchCNNSlim'

    def __init__(self, sketches, labels, keep_prob):
        # For holding a reference to tensors to pass around
        # Used instead of passing an input tensor argument because of @define_scope behavior.
        self.sketches_tensor = sketches
        self.labels_tensor = labels
        self.keep_prob_tensor = keep_prob

        self.total_loss = None
        self.global_step = None

    def build(self, is_training=True):
        self._build_net(self.sketches_tensor, self.labels_tensor, self.keep_prob_tensor, is_training=True)
        self._build_losses()
        self._build_global_step()

    def _build_net(self, sketches, labels, keep_prob):
        net = tf.reshape(sketches, [-1, self.width, self.height, 1])

        # Layer 1, 64 features
        net = tf.contrib.slim.conv2d(net, 64, kernel_size=15, stride=3, padding='VALID')
        net = tf.contrib.slim.max_pool2d(net, stride=2, kernel_size=[3, 3])

        # Layer 2, 128 features
        net = tf.contrib.slim.conv2d(net, 128, kernel_size=5, stride=1, padding='VALID')
        net = tf.contrib.slim.max_pool2d(net, stride=2, kernel_size=[3, 3])

        # Layer 3, three convs with 256 features
        net = tf.contrib.slim.repeat(net, 3, tf.contrib.slim.conv2d, 256, kernel_size=3, stride=1)
        net = tf.contrib.slim.max_pool2d(net, stride=2, kernel_size=3, padding='VALID')
        net = tf.reshape(net, [-1, 7 * 7 * filter_3])

        # Fully-connected dropout layer
        net = tf.contrib.slim.fully_connected(net, 512)
        net = tf.contrib.slim.dropout(net, self.keep_prob_tensor)
        net = tf.contrib.slim.fully_connected(net, 512)
        net = tf.contrib.slim.dropout(net, self.keep_prob_tensor, is_training=is_training)
        logits = tf.contrib.slim.fully_connected(net, self.num_labels)

        # Loss
        tf.contrib.slim.losses.softmax_cross_entropy(logits, labels)

    def _build_losses(self):
        self.total_loss = tf.contrib.slim.losses.get_total_loss()

    def _build_global_step(self):
        self.global_step = tf.contrib.framework.create_global_step()
