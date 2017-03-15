# coding: utf-8


import os
from tqdm import tqdm
import tensorflow as tf
import numpy as np


def get_classes(folder):
    return [x[0].split('/')[-1] for x in os.walk(folder)][1:]


def read_and_flatten(class_dir, ground_truth):
    fnames = [(os.path.join(class_dir, f), ground_truth) 
              for f in os.listdir(class_dir) 
              if os.path.isfile(os.path.join(class_dir, f)) and f.endswith('.png')]
    return fnames


def populate_batch(filenames, final_dim):

    config = tf.ConfigProto(device_count={'GPU': 0, 'CPU': 1})
    g = tf.Graph()
    sess = tf.InteractiveSession(config=config, graph=g)

    with g.as_default():
        filenames, truth_indicies = zip(*filenames)
        filenameQ = tf.train.string_input_producer(filenames)

        # Define a subgraph that takes a filename, reads the file, decodes it, and
        # enqueues it.
        filename = filenameQ.dequeue()
        image_bytes = tf.read_file(filename)
        decoded_image = tf.image.decode_png(image_bytes)
        image_queue = tf.FIFOQueue(128, [tf.float32], None)
        decoded_image = tf.image.resize_images(decoded_image, final_dim)
        enqueue_op = image_queue.enqueue(decoded_image)

        # Create a queue runner that will enqueue decoded images into `image_queue`.
        NUM_THREADS = 16
        queue_runner = tf.train.QueueRunner(
            image_queue,
            [enqueue_op] * NUM_THREADS,  # Each element will be run from a separate thread.
            image_queue.close(),
            image_queue.close(cancel_pending_enqueues=True))

        # Ensure that the queue runner threads are started when we call
        # `tf.train.start_queue_runners()` below.
        tf.train.add_queue_runner(queue_runner)

        # Dequeue the next image from the queue, for returning to the client.
        img = image_queue.dequeue()

        init_op = tf.global_variables_initializer()

        sess.run(init_op)
        coord = tf.train.Coordinator()
        threads = tf.train.start_queue_runners(sess=sess, coord=coord)

        imgs = []
        for _ in filenames:
            if coord.should_stop(): break
            imgs.append(sess.run(img))

        coord.request_stop()

        truth = tf.one_hot(indices=truth_indicies, depth = 250, on_value=1.0, off_value=0.0, axis=-1)
        truth = sess.run(truth)

        # Wait for threads to finish.
        coord.join(threads)

        tf.reset_default_graph()

        return np.array(imgs), truth


def preprocess(directory):
    """
    Returns: list of tuples: (filename, ground truth)
    """
    classes = get_classes(directory)
    num_classes = len(classes)

    imgs = []
    #multiprocess this loop?
    for i in range(num_classes):
        imgs += read_and_flatten(directory +'/'+ classes[i], i)
    return imgs
