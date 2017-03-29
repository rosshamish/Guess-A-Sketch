import sys, os

sys.path.append(os.path.join(os.path.dirname(__file__), '../'))

from flask import Flask, jsonify, request
from flask_cors import CORS
import tfdeploy as td
from PIL import Image
from io import BytesIO
import numpy as np

import scipy.misc
import base64

app = Flask(__name__)
CORS(app)

from preprocessing.data_prep import get_classes

IMAGE_DIR = 'png'
# PKL_PATH = "./experiments/2/mnist_basic.pkl"
PKL_PATH = '/Users/anjueappen/493_capstone/SketchNet/experiments/3/mnist_basic.pkl'


def get_input_and_output(model):
    """
    Recurse through tfdeploy model to get value
    :param model:
    :return:
    """
    output = model.roots[0]
    assert type(output) == td.Tensor  # something we can .eval()

    graph_point = output
    while (graph_point.op != None):
        graph_point = graph_point.op.inputs[0]

    inp = graph_point
    assert type(inp) == td.Tensor

    print("Input found: %s" % inp.name)
    print("Output found: %s" % output.name)
    return inp, output

print("Loading Model from %s" % PKL_PATH)
MODEL = td.Model(PKL_PATH)
inp, outp = get_input_and_output(MODEL)
print("Model Loading Complete")



@app.route("/prompts", methods=['GET'])
def prompts():
    return jsonify(get_classes(IMAGE_DIR))


# TODO accept sketch parameter
@app.route("/submit", methods=['POST'])
def submit():
    base64img = str(request.form['sketch']).split(',')[1]
    img = scipy.misc.imresize(np.array(Image.open(BytesIO(decode_base64(base64img)))), (225, 225))

    # working ^
    print(inp, outp)
    result = outp.eval({inp: img})
    return jsonify([{
                        'label': cls,
                        'confidence': result[i]
                    } for i, cls in enumerate(get_classes(IMAGE_DIR))]);




def decode_base64(data):
    """Decode base64, padding being optional.

    :param data: Base64 data as an ASCII byte string
    :returns: The decoded byte string.

    """
    missing_padding = len(data) % 4
    if missing_padding != 0:
        data += b'='* (4 - missing_padding)
    return base64.decodestring(data)

if __name__ == "__main__":
    app.run()
