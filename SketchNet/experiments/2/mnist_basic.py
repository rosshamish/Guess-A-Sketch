import sys, os
import tensorflow as tf
from tqdm import tqdm

sys.path.append(os.path.join(os.path.dirname(__file__),'../../'))

from utils.tf_graph_scope import define_scope
from preprocessing.data_prep import get_batch
from utils.base_model import Model

conv2d = tf.nn.conv2d
max_pool = tf.nn.max_pool
relu = tf.nn.relu
slim = tf.contrib.slim

width = 225
height = 225
num_labels = 250
batch_size = 135

image = tf.placeholder(tf.float32, [None, width, height])
label = tf.placeholder(tf.float32, [None, num_labels])
keep_prob = tf.placeholder(tf.float32)

filter_1 = 64
filter_2 = 128
filter_3 = 256
filter_4 = 512

x_image = tf.reshape(image, [-1, width, height, 1])  # OK
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
h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

h_fc2 = slim.fully_connected(h_fc1_drop, filter_4)
h_fc2_drop = tf.nn.dropout(h_fc2, keep_prob)

prediction = slim.fully_connected(h_fc2_drop, num_labels)

cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=label, logits=prediction))
tf.summary.scalar('loss', cross_entropy)

train = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)

correct_prediction = tf.equal(tf.argmax(label, 1), tf.argmax(prediction, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
tf.summary.scalar('accuracy', accuracy)


def main():

    # Initialize the FileWriter

    config = tf.ConfigProto()
    config.gpu_options.allow_growth = True

    with tf.Session(config=config) as sess:
        init = tf.global_variables_initializer()
        sess.run(init)

        summary_op = tf.summary.merge_all()
        writer = tf.summary.FileWriter('/tmp/tensorflow/', graph=sess.graph)

        for i in tqdm(range(10)):
            # print(i)
            batch = get_batch(batch_size, (height, width))
            _,  summary_op = sess.run([train, summary_op], {image: batch[0], label: batch[1], keep_prob: 0.5})
            writer.add_summary(summary_op, i)

            # if i % 100 == 0:
            #     summary, train_accuracy = sess.run([summary, accuracy], {image: batch[0], label: batch[1], keep_prob: 1.0})
            #     writer.add_summary(summary, i)
            #     # train_accuracy = sess.run(accuracy, {image: batch[0], label: batch[1], keep_prob: 1.0})
            #     print("step %d, training accuracy %g" % (i, train_accuracy))

        batch = get_batch(batch_size, (height, width), train=False)
        acc = sess.run(accuracy, {image: batch[0], label: batch[1], keep_prob: 1.0})
        print("test accuracy %g" % acc)

        tf.add_to_collection('inputs', image)
        tf.add_to_collection('inputs', keep_prob)
        tf.add_to_collection('output', prediction)
        saver = tf.train.Saver()
        save_path = saver.save(sess, "./%s" % __file__.split('.')[0])
        print("Model saved")





if __name__ == '__main__':
    main()
