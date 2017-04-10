#!/usr/bin/env bash 

# ###
# Unpacks the built application bundle, installs it, and runs it.
# Before running this, you'll want to run deploy.sh locally.
# Usage:
# 	$ ssh into cybera instance
#   $ ./deploy_cybera.sh
#
# (Troubleshooting:)
# - make sure the Cybera instance has HTTP access allowed in Access & Security
# - make sure the conda environment is created correctly (search "conda env create" in setup.sh)
# - make sure the "png" directory is inside ~/Guess-a-Sketch
# ###

METEOR_PORT=8080
MONGO_URL="mongodb://localhost:27017/GuessASketch"
APP_URL="http://guessasketch.net"


# 1. Unzip the app tarball, then delete it. Install Meteor+Node dependencies.
nvm use 4.0 &&
tar -xvzf app.tar.gz &&
rm app.tar.gz &&
pushd bundle/programs/server &&
	npm install &&
popd &&

# 2. Update SketchNet's sources, activate the conda environment, and install python dependencies
pushd Guess-A-Sketch &&
	git checkout master &&
	git pull && 
	source activate tf27 &&
	pip install -r SketchNet/api/requirements.txt &&
popd &&

echo "Dependencies installed successfully."
echo "Now, run both processes:"
echo "1. SketchNet API:"
echo "cd Guess-A-Sketch && python SketchNet/api/api.py"
echo "2. Guess-A-Sketch Meteor App:"
echo "nvm use 4.0 && PORT=8080 MONGO_URL="${MONGO_URL}" ROOT_URL="${APP_URL}" node bundle/main.js"

