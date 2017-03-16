#!/usr/bin/env bash

# Install the basics
sudo apt-get update
sudo apt-get --assume-yes upgrade
sudo apt-get --assume-yes install -y build-essential git python-pip libfreetype6-dev libxft-dev libncurses-dev libopenblas-dev gfortran python-matplotlib libblas-dev liblapack-dev libatlas-base-dev python-dev python-pydot linux-headers-generic linux-image-extra-virtual unzip python-numpy swig python-pandas python-sklearn unzip wget pkg-config zip g++ zlib1g-dev
sudo pip install -U pip

# Update to Cuda Toolkit 8 - instances have Cuda Toolkit 7.5 installed by default
wget http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1404/x86_64/cuda-repo-ubuntu1404_8.0.44-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu1404_8.0.44-1_amd64.deb
sudo apt-get update
sudo apt-get --assume-yes install cuda
rm cuda-repo-ubuntu1404_8.0.44-1_amd64.deb

# Install CuDnn 5.1 for Cuda Toolkit 8.0
wget https://www.dropbox.com/s/p6fae6o2wcbyugk/cudnn-8.0-linux-x64-v5.1.tar
tar -xvf cudnn-8.0-linux-x64-v5.1.tar
sudo cp -R cuda/lib64/libcudnn* /usr/local/cuda/lib64
sudo cp -R cuda/include/cudnn.h /usr/local/cuda/include
rm cudnn-8.0-linux-x64-v5.1.tar
rm -rf cuda

# Set Cuda env vars in bashrc
echo "export CUDA_HOME=/usr/local/cuda" >> ~/.bashrc
echo "export CUDA_ROOT=/usr/local/cuda" >> ~/.bashrc
echo "export PATH=$PATH:$CUDA_ROOT/bin" >> ~/.bashrc
echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$CUDA_ROOT/lib64" >> ~/.bashrc

# Set up Miniconda
wget https://repo.continuum.io/miniconda/Miniconda2-latest-Linux-x86_64.sh
bash Miniconda2-latest-Linux-x86_64.sh -b -p /home/ubuntu/miniconda2
echo "export PATH=/home/ubuntu/miniconda2/bin:$PATH" >> ~/.bashrc
source /home/ubuntu/.bashrc
rm Miniconda2-latest-Linux-x86_64.sh

# Clone Guess-A-Sketch into home and create conda environment
git clone https://github.com/anjueappen/Guess-A-Sketch.git
conda env create -f Guess-A-Sketch/SketchNet/envs/tf_env_linux.yaml
source activate tf27
echo "source activate tf27" >> ~/.bashrc

# Get the images
wget http://cybertron.cg.tu-berlin.de/eitz/projects/classifysketch/sketches_png.zip
unzip sketches_png.zip
rm sketches_png.zip


# Reboot to get Cuda dependancies down
sudo reboot