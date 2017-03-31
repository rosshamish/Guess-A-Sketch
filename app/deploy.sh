#!/usr/bin/env bash 

# ###
# Builds an application bundle and sends it to the Cybera instance.
# After running this, you'll want to ssh in and run deploy_cybera.sh
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
git push && git push --tags &&
npm install --production &&
meteor build . --architecture ${ARCH} &&
scp -i ${SSH_KEY} app.tar.gz ${SSH_TARGET}: &&
echo "---\nSuccessfully built and deployed app.tar.gz to Cybera.\n---"

