import tensorflow as tf


def conv2d(inputs, size_out, name="conv", padding='SAME', stride=1, kernel_size=1):
    size_in = inputs.get_shape().as_list()[3]
    with tf.name_scope(name):
        w = tf.Variable(tf.truncated_normal([kernel_size, kernel_size, size_in, size_out], stddev=0.1),
                    name="{}_weight".format(name))
        b = tf.Variable(tf.constant(0.1, shape=[size_out]), name="{}_bias".format(name))
        conv = tf.nn.conv2d(inputs, w, strides=[1, stride, stride, 1], padding=padding)
        act = tf.nn.relu(conv + b)
        return act


def max_pool2d(inputs, kernel_size=1, stride=2, padding='VALID'):
    return tf.nn.max_pool(inputs, ksize=[1, kernel_size, kernel_size, 1],
                          strides=[1, stride, stride, 1], padding=padding)


def fully_connected(inputs, num_outputs, name="fc"):
    size_in = inputs.get_shape().as_list()[1]
    w = tf.Variable(tf.truncated_normal([size_in, num_outputs], stddev=0.1), name="{}_weight".format(name))
    b = tf.Variable(tf.constant(0.1, shape=[num_outputs]), name="{}_bias".format(name))
    return tf.nn.relu(tf.matmul(inputs, w) + b)