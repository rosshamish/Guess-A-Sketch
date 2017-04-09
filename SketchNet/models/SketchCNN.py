import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__),'../../'))

from utils.base_model import Model
from utils import diy_slim
from utils.tf_graph_scope import define_scope
import tensorflow as tf

conv2d = tf.nn.conv2d
max_pool = tf.nn.max_pool
relu = tf.nn.relu
slim = tf.contrib.slim

class SketchCNN(Model):
    """ 
    Three convolutional max pooling layers, then two fully-connected dropout layers.
    Confidences are finalized with a fully-connected layer with NUM_LABELS outputs.
    """
    labels = []
    EXPERIMENT_ID = 3
    _NAME = 'SketchCNN'


    @define_scope
    def img_embedding(self):
        return tf.Variable(tf.zeros([-1, 7*7*256]), name="test_embedding")
    @define_scope
    def input_images(self):
        return tf.reshape(self.image, [-1, self.width, self.height, 1])

    @define_scope
    def prediction(self):
        flat_conv_pools = self.conv_pools(self.input_images)
        y = self.fc_dropout(flat_conv_pools)
        return y

    @define_scope
    def train(self):
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
        h_conv1 = diy_slim.conv2d(input_tensor, filter_1, kernel_size=15, stride=3, padding='VALID')
        h_pool1 = diy_slim.max_pool2d(h_conv1, stride=2, kernel_size=3)

        # Layer 2, 128 features
        h_conv2 = diy_slim.conv2d(h_pool1, filter_2, kernel_size=5, stride=1, padding='VALID')
        h_pool2 = diy_slim.max_pool2d(h_conv2, stride=2, kernel_size=3)

        # Layer 3, three convs with 256 features
        h_conv3 = diy_slim.conv2d(h_pool2, filter_3, kernel_size=3, stride=1)
        h_conv4 = diy_slim.conv2d(h_conv3, filter_3, kernel_size=3, stride=1)
        h_conv5 = diy_slim.conv2d(h_conv4, filter_3, kernel_size=3, stride=1)
        h_pool5 = diy_slim.max_pool2d(h_conv5, stride=2, kernel_size=3, padding='VALID')

        return tf.reshape(h_pool5, [-1, 7 * 7 * filter_3])

    def fc_dropout(self, input_tensor):
        filter_fc = 512

        h_fc1 = diy_slim.fully_connected(input_tensor, filter_fc)
        h_fc1_drop = tf.nn.dropout(h_fc1, self.keep_prob)
        h_fc2 = diy_slim.fully_connected(h_fc1_drop, filter_fc)
        h_fc2_drop = tf.nn.dropout(h_fc2, self.keep_prob)
        return diy_slim.fully_connected(h_fc2_drop, self.num_labels)

    @define_scope
    def accuracy(self):
        correct_confidence = tf.equal(self.prediction, self.label)
        return tf.reduce_mean(tf.cast(correct_confidence, tf.float32))

    def define_summary_scalars(self):
        print "INF: Defining Summary"
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

