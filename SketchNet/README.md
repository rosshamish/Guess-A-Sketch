SketchNet
===

# Setup

First, put the training images in a directory named `png` at this repo's root directory.

Then, install python2.7. On a Mac, you might need to do `brew install python` then `brew link python`.

Install dependencies
```sh
pip2 install -r SketchNet/api/requirements.txt
```

# Running the API

```sh
$ python2 SketchNet/api/api.py -h
usage: api.py [-h] modeldir metafile {food,animals,easy,standard}

run an API for evaluating a trained tensorflow model.

positional arguments:
  modeldir              the directory containing the model, relative to SketchNet/trained_models
  metafile              the filename (including .meta) of the model to use
  {food,animals,easy,standard}
                        which set of labels to use

optional arguments:
  -h, --help            show this help message and exit
```

Examples:
- `python2 SketchNet/api/api.py exp5easy 20170408-063406_exp5easy_SketchCNN-1500iters-06p.meta easy`
- `python2 SketchNet/api/api.py exp5food 20170410-031600_exp5food_SketchCNN-1500iters-05p.meta food`
- `python2 SketchNet/api/api.py exp5animals 20170410-034745_exp5animals_SketchCNN-1500iters-04p.meta animals`


# How to Setup a Cybera GPU instance for Training 

1. Create a Cybera RAC Account [here](https://rac-portal.cybera.ca)
2. Create a GPU instance following the instructions listed [here](https://docs.google.com/document/d/12_iH7oFfP2MTBi7wCR92PiIalhsB8i2bcz2G89wUsmk/edit#heading=h.uvc95u5xadk8)
3. ssh into your instance with 

        ssh -i cloud.key ubuntu@<floating IP>
        
4. Run the setup script, which will clone this repo, install all dependencies, and reboot the instance. It will take anywhere from 10 minutes to an hour.

        wget https://raw.githubusercontent.com/anjueappen/Guess-A-Sketch/master/SketchNet/envs/setup.sh
        bash setup.sh 
       
5. Wait for the script to complete, and the instance to reboot, then ssh onto your instance.

6. To train a model, run one of the experiments in `SketchNet/experiments/`.

Example: `python SketchNet/experiments/exp5/exp5.py`

##### Here are some outputs you should see - note how the CUDA libraries are opened when you import Tensorflow. 

```
(tf27) ubuntu@tf-instance:~$ conda env list
# conda environments:
#
tf27                  *  /home/ubuntu/miniconda2/envs/tf27
root                     /home/ubuntu/miniconda2

(tf27) ubuntu@tf-instance:~$ python
Python 2.7.13 |Continuum Analytics, Inc.| (default, Dec 20 2016, 23:09:15)
[GCC 4.4.7 20120313 (Red Hat 4.4.7-1)] on linux2
Type "help", "copyright", "credits" or "license" for more information.
Anaconda is brought to you by Continuum Analytics.
Please check out: http://continuum.io/thanks and https://anaconda.org
>>> import tensorflow
I tensorflow/stream_executor/dso_loader.cc:135] successfully opened CUDA library libcublas.so.8.0 locally
I tensorflow/stream_executor/dso_loader.cc:135] successfully opened CUDA library libcudnn.so.5 locally
I tensorflow/stream_executor/dso_loader.cc:135] successfully opened CUDA library libcufft.so.8.0 locally
I tensorflow/stream_executor/dso_loader.cc:135] successfully opened CUDA library libcuda.so.1 locally
I tensorflow/stream_executor/dso_loader.cc:135] successfully opened CUDA library libcurand.so.8.0 locally
>>>
```
