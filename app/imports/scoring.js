import { _ } from 'meteor/underscore';
import { Sketches } from '/imports/api/collections/sketches';

export function getSketchScore(sketch) {
  // TODO actually score the sketch using SketchNet's output
  return Math.floor(Math.random()*100);
}

function sum(arr) {
  return _.reduce(arr, (sum, score) => {
    return sum + score;
  }, 0);
}

export function getRoundScore(round, player) {
  let sketches = _.filter(round.sketches, (sketchID) => {
    let sketch = Sketches.findOne({ _id: sketchID });
    if (!sketch) {
      console.error('Couldnt find sketch with id ' + sketchID);
      return false;
    } else {
      return sketch.player.name === player.name;
    }
  });
  let scores = _.map(sketches, (sketch) => {
    return getSketchScore(sketch);
  });

  if (sketches.length < 1) {
    console.error('Player did not submit a sketch.');
    return 0;
  } else if (sketches.length > 1) {
    console.error('Player submitted multiple sketches.');
    return sum(scores);
  } else {
    return scores[0];
  }
}

export function getGameScore(room, player) {
  let scores = _.map(room.rounds, (round) => {
    return getRoundScore(round, player);
  });
  return sum(scores);
}
