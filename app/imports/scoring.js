import { _ } from 'meteor/underscore';
import { Sketches } from '/imports/api/collections/sketches';

function getStarRating(sketch) {
  if (!sketch.scores || !sketch.scores.length) {
    console.error('Cant score sketch with no scores');
    console.error('Sketch was:');
    console.error(sketch);
    return 0;
  }

  // TODO actually calculate this score.
  return 3;
}

export function getSketchScore(sketch) {
  // TODO actually score the sketch using SketchNet's output
  return getStarRating(sketch);
}

function sum(arr) {
  return _.reduce(arr, (sum, score) => {
    return sum + score;
  }, 0);
}

export function getRoundScore(round, player) {
  const sketches = _.map(round.sketches, (sketchID) => Sketches.findOne(sketchID));
  const byPlayer = _.filter(sketches, (sketch) => 
      sketch.player.name === player.name
  );
  const scores = _.map(byPlayer, getSketchScore);

  if (scores.length < 1) {
    console.error('Cant score round. Player did not submit a sketch.');
    return 0;
  } else if (scores.length > 1) {
    console.error('Cant score round. Player submitted multiple sketches.');
    return 0;
  }

  return scores[0];
}

export function getGameScore(room, player) {
  let scores = _.map(room.rounds, (round) => {
    return getRoundScore(round, player);
  });
  return sum(scores);
}
