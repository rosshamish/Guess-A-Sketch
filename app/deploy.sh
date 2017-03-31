#!/usr/bin/env bash 

# ###
# Deploys the Meteor app to our Cybera instance.
# - builds an application bundle, and send it to the Cybera instance.
# - runs deploy_cybera.sh on the instance via ssh, which installs and runs it.
# Usage:
# 	./deploy.sh [version] [ssh key]
# ###

# Command-line parameters
VERSION=$1
SSH_KEY=$2

# Constants
SSH_USER=ubuntu
SSH_ADDR=162.246.157.134
ARCH=os.linux.x86_64
DEPLOY_BRANCH=master

# Composites
SSH_TARGET="${SSH_USER}@${SSH_ADDR}"

git checkout ${DEPLOY_BRANCH} &&
echo "${VERSION}" > VERSION &&
git add VERSION &&
git commit -m "Deploy version ${VERSION}" &&
git tag ${VERSION} &&
npm install --production &&
meteor build . --architecture ${ARCH} &&
scp -i ${SSH_KEY} app.tar.gz ${SSH_TARGET}: &&
cat deploy_cybera.sh | ssh -i ${SSH_KEY} ${SSH_TARGET} &&
echo '---\nSuccessfully built and deployed app.tar.gz to Cybera.\n---'

