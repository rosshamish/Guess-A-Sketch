import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__),'../'))

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

import random
from preprocessing.data_prep import get_classes

IMAGE_DIR = 'png'

@app.route("/prompts", methods=['GET'])
def prompts():
    return jsonify(get_classes(IMAGE_DIR))


# TODO accept sketch parameter
@app.route("/submit", methods=['POST'])
def submit():
    sketchPng = request.form['sketch']
    return jsonify([{
        'label': cls,
        'confidence': abs(random.normalvariate(0.4, 0.15))
    } for cls in get_classes(IMAGE_DIR)]);


if __name__ == "__main__":
    app.run()