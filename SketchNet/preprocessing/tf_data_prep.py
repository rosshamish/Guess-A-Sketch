# coding: utf-8


import os
from tqdm import tqdm
import tensorflow as tf
import numpy as np

from utils.tf_graph_scope import define_scope


def get_classes(folder):
    return [x[0].split('/')[-1] for x in os.walk(folder)][1:]


def read_and_flatten(class_dir, ground_truth):
    fnames = [(os.path.join(class_dir, f), ground_truth) 
              for f in os.listdir(class_dir) 
              if os.path.isfile(os.path.join(class_dir, f)) and f.endswith('.png')]
    return fnames

def preprocess(directory):
    """
    Returns: list of tuples: (filename, ground truth)
    """
    classes = get_classes(directory)
    num_classes = len(classes)

    imgs = []
    for i in range(num_classes):
        imgs += read_and_flatten(directory +'/'+ classes[i], i)
    return imgs


class DataGenerator(object):

    def __init__(self, filenames, height, width, truth):
        self.height = height
        self.width = width
        self.filenames = filenames
        self.truth = truth

    @define_scope
    def dequeue_img(self):

        filenameQ = tf.train.string_input_producer(self.filenames)

        # Define a subgraph that takes a filename, reads the file, decodes it, and
        # enqueues it.
        filename = filenameQ.dequeue()
        image_bytes = tf.read_file(filename)
        decoded_image = tf.image.decode_png(image_bytes)
        image_queue = tf.FIFOQueue(128, [tf.float32], None)
        decoded_image = tf.image.resize_images(decoded_image, (self.height, self.width))
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
        return img

    @define_scope
    def ground_truth(self):
        return tf.one_hot(indices=self.truth, depth=250, on_value=1.0, off_value=0.0, axis=-1)


def get_batch(session, fnames, dims):

    # config = tf.ConfigProto(device_count={'GPU': 0, 'CPU': 1})
    # g = tf.Graph()
    # # sess = tf.InteractiveSession(config=config, graph=g)
    #
    # with tf.InteractiveSession(config=config, graph=g) as sess:
    #     with g.as_default():


    fnames, truth_indicies = zip(*fnames)

    filenames = tf.placeholder(tf.string, [len(fnames)])
    height = tf.placeholder(tf.int32)
    width = tf.placeholder(tf.int32)
    truth = tf.placeholder(tf.float32, [len(fnames)])

    datagenerator = DataGenerator(fnames, height, width, truth)

    coord = tf.train.Coordinator()
    threads = tf.train.start_queue_runners(sess=session, coord=coord)
    imgs = []
    for _ in tqdm(range(len(fnames))):
        if coord.should_stop(): break
        imgs.append(session.run(datagenerator.dequeue_img, {filenames: fnames, height: dims[0],
                                                            width: dims[1], truth: truth_indicies}))

    coord.request_stop()
    truth = session.run(datagenerator.ground_truth)

    # Wait for threads to finish.
    coord.join(threads)

    # tf.reset_default_graph()
    return np.array(imgs), truth


