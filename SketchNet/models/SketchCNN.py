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
    _NAME = 'SketchCNN'

    """ 
    Three convolutional max pooling layers, then two fully-connected dropout layers.
    Confidences are finalized with a fully-connected layer with NUM_LABELS outputs.
    """
    labels = []
    EXPERIMENT_ID = 3

    @define_scope
    def prediction(self):
        x_image = tf.reshape(self.image, [-1, self.width, self.height, 1])
        flat_conv_pools = self.conv_pools(x_image)
        y = self.fc_dropout(flat_conv_pools)
        return y

    @define_scope
    def train(self):
        # tf.summary.scalar('cross_entropy', cross_entropy)
        return tf.train.AdamOptimizer(1e-4).minimize(self.loss)

    @define_scope
    def loss(self):
        measure = tf.nn.softmax_cross_entropy_with_logits(
            labels=self.label,
            logits=self.prediction)
        return tf.reduce_mean(measure)

    def conv_pools(self, input_tensor):
        filter_1 = 64
        filter_2 = 128
        filter_3 = 256

        # Layer 1, 64 features
        h_conv1 = slim.conv2d(input_tensor, filter_1, kernel_size=15, stride=3, padding='VALID')
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

    def fc_dropout(self, input_tensor):
        filter_fc = 512

        h_fc1 = slim.fully_connected(input_tensor, filter_fc)
        h_fc1_drop = tf.nn.dropout(h_fc1, self.keep_prob)
        h_fc2 = slim.fully_connected(h_fc1_drop, filter_fc)
        h_fc2_drop = tf.nn.dropout(h_fc2, self.keep_prob)
        return slim.fully_connected(h_fc2_drop, self.num_labels)

    @define_scope
    def accuracy(self):
        correct_confidence = tf.equal(self.prediction, self.label)
        return tf.reduce_mean(tf.cast(correct_confidence, tf.float32))

    def define_summary_scalars(self):
        tf.summary.scalar('cross_entropy', self.loss)
        tf.summary.scalar('accuracy', self.accuracy)