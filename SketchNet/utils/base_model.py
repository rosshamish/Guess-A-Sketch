import abc
from abc import abstractmethod


class Model(object):
    __metaclass__ = abc.ABCMeta

    # Subclasses should use this.
    _NAME = 'Model'

    def __init__(self, image, width, height, num_labels, label, keep_prob):
        # Legacy support:
        # - support old models that use these names for the input tensors
        self.image = image
        self.label = label
        self.keep_prob = keep_prob
        # New names, to better reflect that they are graph elements, not arrays/values
        self.images_tensor = image
        self.labels_tensor = label
        self.keep_prob_tensor = keep_prob



        self.width = width
        self.height = height
        self.num_labels = num_labels

        # Magic statements. Initializes these Tensors / subgraphs, to cache for later.
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

    