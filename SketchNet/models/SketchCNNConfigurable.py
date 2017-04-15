import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__),'../../'))

import logging
log = logging.getLogger(__name__)

from utils.base_model import Model
from utils.tf_graph_scope import define_scope
import tensorflow as tf
slim = tf.contrib.slim


class SketchCNNConfigurable(Model):
    """
    SketchCNN architecture, but configurable via a host of args.
    """
    _NAME = 'SketchCNNConfigurable'

    __CONFIG_DEFAULT = {
        'learning_rate': 1e-3,
        'loss_fn': tf.nn.softmax_cross_entropy_with_logits,
        'convs': [
            { 'filter_size': 64, 'kernel_size': 15 },
            { 'filter_size': 128, 'kernel_size': 5 },
            { 'filter_size': 256, 'kernel_size': 3 },
        ],
        'fully_connected': [
            { 'nodes': 512 },
            { 'nodes': 512 },
        ]
    }

    def __init__(self, *args, **kwargs):
        # For holding a reference to tensors to pass around
        # Used instead of passing an input tensor argument because of @define_scope behavior.
        self._conv_pools_in = None
        self._fc_dropout_in = None

        # Default kwargs shown here, and overwritten by any custom ones passed
        self.config = dict(self.__CONFIG_DEFAULT)
        if 'config' in kwargs and kwargs['config'] is not None:
            for key, val in kwargs['config'].iteritems():
                if val is not None:
                    self.config[key] = val
        kwargs.pop('config', None)

        # Initialize prediction, train, accuracy, Tensors / subgraphs
        # Also set some properties
        super(SketchCNNConfigurable, self).__init__(*args, **kwargs)

        # Magic statement. Initialize this Tensor / subgraph, to cache for later.
        self._conv_pools
        self._fc_dropout

    @define_scope
    def img_embedding(self):
        return tf.Variable(tf.zeros([-1, 7*7*256]), name="test_embedding")

    @define_scope
    def input_images(self):
        return tf.reshape(self.image, [-1, self.width, self.height, 1])

    @define_scope
    def prediction(self):
        self._conv_pools_in = tf.reshape(self.images_tensor, [-1, self.width, self.height, 1])
        self._fc_dropout_in = self._conv_pools
        y = self._fc_dropout
        return y

    @define_scope
    def train(self):
        # tf.summary.scalar('cross_entropy', cross_entropy)
        learning_rate_config = self.config.get('learning_rate', None)
        if learning_rate_config is None:
            log.warn('Expected learning rate configuration')
        return tf.train.AdamOptimizer(self.config['learning_rate']).minimize(self.loss)

    @define_scope
    def loss(self):
        loss_fn_config = self.config.get('loss_fn', None)
        if loss_fn_config is None:
            log.error('Expected loss function configuration')
        measure = self.config['loss_fn'](
            labels=self.labels_tensor,
            logits=self.prediction)
        return tf.reduce_mean(measure)

    @define_scope
    def _conv_pools(self):
        config_conv = self.config.get('convs', None)
        if config_conv is None:
            log.warn('Expected convolution layer configuration')
        if len(config_conv) != 3:
            log.warn('Expected three convolution layer configurations')
        for config_conv_layer in config_conv:
            if 'filter_size' not in config_conv_layer:
                log.warn('Expected filter size config for convolution layer')
            if 'kernel_size' not in config_conv_layer:
                log.warn('Expected kernel size config for convolution layer')

        # Layer 1, 64 features
        layer_config = config_conv[0]
        net = slim.conv2d(self._conv_pools_in, layer_config['filter_size'], kernel_size=layer_config['kernel_size'], stride=3, padding='VALID')
        net = slim.max_pool2d(net, stride=2, kernel_size=[3, 3])

        # Layer 2, 128 features
        layer_config = config_conv[1]
        net = slim.conv2d(net, layer_config['filter_size'], kernel_size=layer_config['kernel_size'], stride=1, padding='VALID')
        net = slim.max_pool2d(net, stride=2, kernel_size=[3, 3])

        # Layer 3, three convs with 256 features
        layer_config = config_conv[2]
        net = slim.conv2d(net, layer_config['filter_size'], kernel_size=layer_config['kernel_size'], stride=1)
        net = slim.conv2d(net, layer_config['filter_size'], kernel_size=layer_config['kernel_size'], stride=1)
        net = slim.conv2d(net, layer_config['filter_size'], kernel_size=layer_config['kernel_size'], stride=1)
        net = slim.max_pool2d(net, stride=2, kernel_size=[3, 3], padding='VALID')
        return tf.reshape(net, [-1, 7 * 7 * layer_config['filter_size']])

    @define_scope
    def _fc_dropout(self):
        config_fc = self.config.get('fully_connected', None)
        if config_fc is None:
            log.warn('Fully connected configuration is missing')
        if len(config_fc) != 2:
            log.warn('Expected two fully connected layer configurations')
        for config_fc_layer in config_fc:
            if 'nodes' not in config_fc_layer:
                log.warn('Expected config to specify number of nodes in layer')
        net = slim.fully_connected(self._fc_dropout_in, config_fc[0]['nodes'])
        net = tf.nn.dropout(net, self.keep_prob_tensor)
        net = slim.fully_connected(net, config_fc[1]['nodes'])
        net = tf.nn.dropout(net, self.keep_prob_tensor)
        return slim.fully_connected(net, self.num_labels)

    @define_scope
    def accuracy(self):
        correct_prediction = tf.equal(tf.argmax(self.labels_tensor, 1), tf.argmax(self.prediction, 1))
        return tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

    #TODO: list of input imgs and result from eval()
    #
    #TODO: create sorite image
    # TODO: add op to re-render the image
    def define_summary_scalars(self):
        config = tf.contrib.tensorboard.plugins.projector.ProjectorConfig()
        embedding_config = config.embeddings.add()
        # embedding_config.tensor_name = embedding.name
        # embedding_config.sprite.image_path = self.LOGDIR + 'sprite_1024.png'
        # embedding_config.metadata_path = LOGDIR + 'labels_1024.tsv'
        # # Specify the width and height of a single thumbnail.
        # embedding_config.sprite.single_image_dim.extend([28, 28])

        # tf.contrib.tensorboard.plugins.projector.visualize_embeddings(writer, config)
        tf.summary.image('input_imgs', self.input_images, 3)
        tf.summary.scalar('cross_entropy', self.loss)
        tf.summary.scalar('accuracy', self.accuracy)
