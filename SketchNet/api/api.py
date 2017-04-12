"""
SRS 3.2.4.1 Image Score Endpoint

This module accepts an image as a Base64 string,
and returns an array
"""
import sys, os
import argparse
import mock

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import labels
from flask import Flask, jsonify, request
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
from io import BytesIO
import numpy as np
import scipy.misc
import base64
from err import ClassificationFailure
from preprocessing.data_prep import get_classes

app = Flask(__name__)
CORS(app)

def create_test_app(args):
    main(args)
    return app

# ###
# Constants, don't change these
# ###
__PROJECT_ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
__IMAGE_DIR = os.path.join(__PROJECT_ROOT, 'png')
# Keep in sync with experiments.experiment.Experiment, TODO refactor
__TRAINED_MODEL_DIR = os.path.join(__PROJECT_ROOT, 'SketchNet', 'trained_models')


def eval_img(img):
    v = sess.run(prediction_tensor, {
        image_tensor: img,
        keep_prob_tensor: 1.0
    })
    return v[0]


@app.route("/prompts", methods=['GET'])
def prompts():
    return jsonify(get_classes(__IMAGE_DIR))


@app.route("/submit", methods=['POST'])
def submit():
    try:
        base64img = str(request.form['sketch']).split(',')[1]
        img = scipy.misc.imresize(np.array(Image.open(BytesIO(decode_base64(base64img)))), (225, 225))

        # handle color channels
        if len(img.shape) > 2:
            img = img[:, :, 0] + img[:, :, 1] + img[:, :, 2] + img[:, :, 3]
            img[img > 0] = 255

        if np.count_nonzero(img) > 0:
            # add batch_size dimension
            img = np.expand_dims(img, axis=0)
            result = eval_img(img)
            result = result/max(result)
        else:
            # Empty sketch should get 0 confidence for all labels
            result = [0]*len(__LABELS)

        return jsonify([{
                            'label': label,
                            'confidence': float(result[i])
                        } for i, label in enumerate(__LABELS)])
    except Exception as e:
        raise ClassificationFailure(message=str(e))


@app.errorhandler(ClassificationFailure)
def handle_classification_failure(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


def decode_base64(data):
    """Decode base64, padding being optional.

    :param data: Base64 data as an ASCII byte string
    :returns: The decoded byte string.

    """
    missing_padding = len(data) % 4
    if missing_padding != 0:
        data += b'='* (4 - missing_padding)
    return base64.decodestring(data)


def main(args):
    # Globals: sess, image_tensor, keep_prob_tensor, prediction_tensor
    # Easier to use globals here cause of the way Flask's app.run() method works.
    global sess, image_tensor, keep_prob_tensor, prediction_tensor
    global __CHECKPOINT_DIR, __META_FILE, __LABELS

    __CHECKPOINT_DIR = os.path.join(__TRAINED_MODEL_DIR, args.modeldir)
    __META_FILE = os.path.join(__CHECKPOINT_DIR, args.metafile)
    __LABELS = {
        'standard': labels.standard,
        'easy': labels.easy,
        'food': labels.food,
        'animals': labels.animals
    }[args.labels]

    sess = tf.Session()
    try:
        print("Restoring Saver: {}".format(__META_FILE))
        new_saver = tf.train.import_meta_graph(__META_FILE)
        print("Restoring Checkpoint: {}".format(__CHECKPOINT_DIR))
        new_saver.restore(sess, tf.train.latest_checkpoint(__CHECKPOINT_DIR))

        inps = tf.get_collection('inputs')
        image_tensor = inps[0]
        keep_prob_tensor = inps[1]
        # Legacy experiment support.
        # The keep_prob Tensor should have shape None, cause it's a scalar.
        # However, once upon a time, inps[1] was the labels Tensor with shape (None,250), instead of
        # the keep_prob Tensor with shape None, because Ross is a donut.
        # This is a cheesy fix which makes the API work even with trained models from that dark era.
        # The end.
        if keep_prob_tensor.shape is not None and len(inps) > 2:
            keep_prob_tensor = inps[2]

        prediction_tensor = tf.get_collection('output')[0]
    except Exception as e:
        print(e)
        raise

    if not args.t: #if test flag not set
        app.run()

# ###
# Choose which trained model to use.
# - modeldir is the directory in trained_models. Usually indicates experiment number & dataset.
# - metafile is which meta file (-> graph definition) to use inside that folder
#   - version filenames look like "timestamp_experiment-name_model-name_trained_iterations"
# - labels should be the same as the model was trained on, see labels.py
#
# The API will serve the model with
# - the latest .index/.data training information, specified by the checkpoint file in modeldir
# - the .meta graph definition, specified by modeldir/metafile
# - the ordered list of labels they were trained on, specified by labels
#
# Warnings
# - If the checkpoint, meta, index, or data files don't exist, it'll crash on startup.
# - If the model is incompatible with the current API, it might run, then break on POST /submit.
# ###

def create_parser():
    parser = argparse.ArgumentParser(description='run an API for evaluating a trained tensorflow model.')
    parser.add_argument('modeldir', help='the path to the directory containing the model.')
    parser.add_argument('metafile', help='the filename (including .meta) of the model to use')
    parser.add_argument('labels', help='which set of labels to use', choices=set(['standard', 'easy', 'food', 'animals']))
    parser.add_argument('-t', help='testing flag: Omit to start app on creation', action='store_true')
    return parser

if __name__ == "__main__":
    parser = create_parser()
    main(parser.parse_args())
