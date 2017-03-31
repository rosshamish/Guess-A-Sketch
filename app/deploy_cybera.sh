#!/usr/bin/env bash 

# ###
# To be run on the Cybera instance.
# Unpacks the built application bundle, installs it, and runs it.
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
tar -xvzf app.tar.gz &&
rm app.tar.gz &&
pushd bundle/programs/server &&
	npm install &&
popd

# 2. Update SketchNet's sources, activate the conda environment, and install python dependencies
pushd Guess-A-Sketch && 
	git pull && 
	source activate tf27 &&
	pip install -r SketchNet/api/requirements.txt &&
popd

# 3. Run SketchNet!
pushd Guess-A-Sketch &&
	python SketchNet/api/api.py &
	echo "SketchNet API running as pid $!" &&
popd

# 4. Run Guess-a-Sketch!
nvm use 4.0 &&
PORT=${METEOR_PORT} MONGO_URL=${MONGO_URL} ROOT_URL=${APP_URL} node bundle/main.js &
echo "Guess-a-Sketch Meteor App running as pid $!"
