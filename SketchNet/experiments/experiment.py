import abc
from abc import abstractmethod


class Experiment(object):
    __metaclass__ = abc.ABCMeta

    def __init__(self, image, width, height, num_labels, label, keep_prob):
        self.image = image
        self.label = label
        self.keep_prob = keep_prob
        self.width = width
        self.height = height
        self.num_labels = num_labels

        self.prediction
        self.train
        self.accuracy

    @abstractmethod
    def prediction(self):
        pass

    @abstractmethod
    def train(self):
        pass

    @abstractmethod
    def accuracy(self):
        pass