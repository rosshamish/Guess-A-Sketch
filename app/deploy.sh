# ###
# Build and deploy the application to Cybera
# ###
git pull &&
git checkout master &&
npm install --production &&
meteor build . --architecture os.linux.x86_64 &&
scp -i ../../cloud.key app.tar.gz ubuntu@162.246.157.134:
echo '\n\nSuccessfully built and deployed app.tar.gz to Cybera.'
echo 'Now, ssh in and do the rest!'
echo '(See deploy.sh comments for instructions and troubleshooting)'

# ###
# Then, on the Cybera instance, do the following
# (Troubleshooting:)
# - make sure the Cybera instance has HTTP access allowed in Access & Security
# - make sure the conda environment is created correctly (search "conda env create" in setup.sh)
# - make sure the "png" directory is inside ~/Guess-a-Sketch
# ###
# 1. Untar the Meteor bundle and install Meteor/Node dependencies
# tar -xvzf app.tar.gz && pushd bundle/programs/server && npm install && popd
# 2. Update SketchNet's sources and install dependencies
# cd Guess-A-Sketch && git pull && source activate tf27 && pip install -r SketchNet/api/requirements.txt
# 3. Run SketchNet!
# cd Guess-A-Sketch
# python SketchNet/api/api.py
# 4. Run Guess-a-Sketch!
# nvm use 4.0 && PORT=8080 MONGO_URL='mongodb://localhost:27017/GuessASketch' ROOT_URL='http://guessasketch.net' node bundle/main.js
