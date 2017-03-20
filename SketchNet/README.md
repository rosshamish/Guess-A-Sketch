# How to Setup Your GPU instance for Training 

1. Create a Cybera RAC Account [here](https://rac-portal.cybera.ca)
2. Create a GPU instance following the instructions listed [here](https://docs.google.com/document/d/12_iH7oFfP2MTBi7wCR92PiIalhsB8i2bcz2G89wUsmk/edit#heading=h.uvc95u5xadk8)
3. ssh into your instance with 

        ssh -i cloud.key ubuntu@<floating IP>
        
4. Run the setup script

        wget https://raw.githubusercontent.com/anjueappen/Guess-A-Sketch/master/SketchNet/envs/setup.sh
        bash setup.sh 
       
5. The script completes by rebooting up your instance. After a minute, ssh back onto your instance and you should be able to train models via GPU


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
