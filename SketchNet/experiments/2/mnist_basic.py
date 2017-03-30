import sys, os
import tensorflow as tf
from tqdm import tqdm
import tfdeploy as td

sys.path.append(os.path.join(os.path.dirname(__file__),'../../'))

from utils.tf_graph_scope import define_scope
from preprocessing.data_prep import get_batch
from utils.base_model import Model
from utils.tf_utils import weight_variable, bias_variable

conv2d = tf.nn.conv2d
max_pool = tf.nn.max_pool
relu = tf.nn.relu
slim = tf.contrib.slim


class Exp1Model(Model):
    @define_scope
    def prediction(self):
        filter_1 = 64
        filter_2 = 128
        filter_3 = 256
        filter_4 = 512

        x_image = tf.reshape(self.image, [-1, self.width, self.height, 1])  # OK
        h_conv1 = slim.conv2d(x_image, filter_1, kernel_size=15, stride=3, padding='VALID')
        h_pool1 = slim.max_pool2d(h_conv1, stride=2, kernel_size=[3, 3])

        # Layer 2
        h_conv2 = slim.conv2d(h_pool1, filter_2, kernel_size=5, stride=1, padding='VALID')
        h_pool2 = slim.max_pool2d(h_conv2, stride=2, kernel_size=[3, 3])

        h_conv3 = slim.conv2d(h_pool2, filter_3, kernel_size=3, stride=1)
        h_conv4 = slim.conv2d(h_conv3, filter_3, kernel_size=3, stride=1)
        h_conv5 = slim.conv2d(h_conv4, filter_3, kernel_size=3, stride=1)
        h_pool5 = slim.max_pool2d(h_conv5, stride=2, kernel_size=3, padding='VALID')

        h_pool5_flat = tf.reshape(h_pool5, [-1, 7 * 7 * filter_3])
        h_fc1 = slim.fully_connected(h_pool5_flat, filter_4)
        h_fc1_drop = tf.nn.dropout(h_fc1, self.keep_prob)

        h_fc2 = slim.fully_connected(h_fc1_drop, filter_4)
        h_fc2_drop = tf.nn.dropout(h_fc2, self.keep_prob)
       
        y_conv = slim.fully_connected(h_fc2_drop, self.num_labels)
        #W_fc1 = weight_variable([1 * 1 * filter_4, self.num_labels])
        #b_fc1 = bias_variable([self.num_labels])
        #y_conv = tf.nn.relu(tf.matmul(h_fc2_drop, W_fc1) + b_fc1)
        return y_conv

    @define_scope
    def train(self):
        cross_entropy = tf.reduce_mean(
            tf.nn.softmax_cross_entropy_with_logits(labels=self.label, logits=self.prediction))
        # tf.summary.scalar('cross_entropy', cross_entropy)
        return tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)

    @define_scope
    def accuracy(self):
        correct_prediction = tf.equal(tf.argmax(self.label, 1), tf.argmax(self.prediction, 1))
        accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
        return accuracy


def main():
    # TODO Hard Coding!!!
    train = True
    width = 225
    height = 225
    num_labels = 250
    batch_size = 135

    image = tf.placeholder(tf.float32, [None, width, height])
    label = tf.placeholder(tf.float32, [None, num_labels])
    keep_prob = tf.placeholder(tf.float32)

    model = Exp1Model(image, width, height, num_labels, label, keep_prob)

    # Initialize the FileWriter
    # tf.summary.scalar('accuracy', model.accuracy)
    summary = tf.summary.merge_all()
    writer = tf.summary.FileWriter('/tmp/tensorflow/', graph=tf.get_default_graph())

    config = tf.ConfigProto()
    config.gpu_options.allow_growth = True
    with tf.Session(config=config) as sess:
        init = tf.global_variables_initializer()
        sess.run(init)

        for i in tqdm(range(15000)):
            # print(i)
            batch = get_batch(batch_size, (height, width))
            sess.run(model.train, {image: batch[0], label: batch[1], keep_prob: 0.5})

            if i % 100 == 0:
                # summary, train_accuracy = sess.run([summary, model.accuracy], {image: batch[0], label: batch[1], keep_prob: 1.0})
                train_accuracy = sess.run(model.accuracy,
                                                   {image: batch[0], label: batch[1], keep_prob: 1.0})
                # writer.add_summary(summary, i)
                print("step %d, training accuracy %g" % (i, train_accuracy))

        batch = get_batch(batch_size, (height, width), train=False)
        acc = sess.run(model.accuracy, {image: batch[0], label: batch[1], keep_prob: 1.0})
        print("test accuracy %g" % acc)

	#deploy_model = td.Model()
        #deploy_model.add(model.prediction, sess)
        #deploy_model.save("./%s.pkl" % __file__.split('.')[0])
        saver = tf.train.Saver()
        save_path = saver.save(sess, "%s" % __file__.split('.')[0])
        print("Model saved in %s" %save_path)


if __name__ == '__main__':
    main()
