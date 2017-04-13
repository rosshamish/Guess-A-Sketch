# Guess-a-Sketch Web Application

### Setup instructions

Install meteor
```sh
curl https://install.meteor.com/ | sh
```

Install npm using your system's package manager. See https://docs.npmjs.com/getting-started/installing-node

Install npm packages
```sh
cd app && npm install
```

### Running the app

Run
```sh
cd app && meteor run
```

Then, go to http://localhost:3000

If you'd like to access the app on a different device, e.g. your phone, first ensure that your phone and computer are on the same network. Then, find your computer's IP, e.g. with `ifconfig`. Then, navigate to http://your.ip.here:3000.

### Running UI Tests

```sh
npm install -g storybook
cd app && npm run storybook
```

### User instructions

The UI is very straightforward, and was designed to be usable on the first try, with no instructions or prior training. However, for completeness, we include here a brief set of instructions for hosting a game, as well as playing in a game.

#### Hosting a game

1. On the homepage, click Host

2. Pick a name for the room, set the number of rounds, and the length of each rounds in seconds.

3. Pick a **mode** for the room. This is the subset of categories which will be used. At the time of writing, the options are standard, easy, food, and animals. Standard is all 250 categories.

4. Click Create Room

5. Wait for players to join the room. When you're ready, click Start.

6. After each round, you'll need to click Next Round to start the next round. At the end of the game, you'll need to click End Game to go to the final scoreboard.

#### Playing in a game

1. On the homepage, click Play

2. Pick a name and a pencil color, then click Go.

3. Tap on a room marked as JOINABLE to join it. If the room you'd like to join is not JOINABLE, wait until the current round is over. You'll be able to join between rounds.

4. Each round, draw the given prompt. When the round ends, your sketch will be scored, and you'll be shown the top 3 guesses from the neural network. Your sketch will be assigned a star rating based on how close the network was to guessing the correct prompt.

5. After all rounds, the player with the most stars wins!