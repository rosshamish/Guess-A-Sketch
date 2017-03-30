# ###
# Build and deploy the application to Cybera
# ###
git pull &&
git checkout master &&
npm install --production &&
meteor build . --architecture os.linux.x86_64 &&
scp -i ../../cloud.key app.tar.gz ubuntu@162.246.157.134: &&

# ###
# Then, on the Cybera instance, do
# ###
# tar -xvzf app.tar.gz
# pushd bundle/programs/server && npm install && popd
# NODE_URL='mongodb://localhost:27017/GuessASketch' ROOT_URL='http://guessasketch.net' node server/main.js
