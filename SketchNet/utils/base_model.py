import abc
from abc import abstractmethod
import tensorflow as tf

from utils.tf_graph_scope import define_scope


class Model(object):
    __metaclass__ = abc.ABCMeta

    # Subclasses should use this.
    _NAME = 'Model'

    def __init__(self, image, width, height, num_labels, label, keep_prob):
        self.image = image
        self.label = label
        self.keep_prob = keep_prob
        self.width = width
        self.height = height
        self.num_labels = num_labels

        # Magic statements.
        # Initializes the methods somehow.
        # Subclass doesn't have __init__ method so maybe instantiating sub
        # (with abstracts overrridden) defines the graph scope?
        self.prediction
        self.train
        self.accuracy
        self.summary

    @abstractmethod
    def input_images(self):
        pass

    @abstractmethod
    def prediction(self):
        pass

    @abstractmethod
    def train(self):
        pass

    @abstractmethod
    def accuracy(self):
        pass

    @abstractmethod
    def loss(self):
        pass

    @abstractmethod
    def define_summary_scalars(self):
        """
        A place to put all summary.scalar calls
        :return: None
        """
        pass

    @define_scope
    def summary(self):
        self.define_summary_scalars() #TODO: refactor out to dict?
        return tf.summary.merge_all()
