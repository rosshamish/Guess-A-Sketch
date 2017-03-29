import { _ } from 'underscore';
// import { Sketches } from '/imports/api/collections/sketches';

function clamp(val, low, high) {
  // Clamps val between low and high, inclusive.
  return Math.max( low, Math.min( val, high) );
}

function getRank(sketch) {
  const byConfidence = _.sortBy(sketch.scores, s => -1 * s.confidence);
  const labels = _.pluck(byConfidence, 'label');
  const rank = _.indexOf(labels, sketch.prompt);
  if (!rank || rank === -1) {
    return sketch.scores.length;
  }
  return rank;
}

function getCorrectLabelConfidence(sketch) {
  const score = _.find(sketch.scores, s => s.label === sketch.prompt);
  if (!score) {
    return 0;
  }
  return score.confidence;
}

export function getStarRating(rank, confidence) {
  let rawRating;
  const maxRating = 5;
  const minRating = 0;

  // Give points for the rank of the correct label.
  // rank := position of label in the scores list when sorted by confidence.
  let rankComponent;
  const bestRank = 0;
  const maxRank = 250;
  const rankFn = (rank) => {
    return Math.log((maxRank - rank) + 1);
  };

  // Give points for how confident we were about the correct label.
  // how confident := confidence on [0,1]
  let confidenceComponent;
  const bestConfidence = 1;
  const confidenceA = 1;
  const confidenceB = 0.5;
  const confidenceFn = (_confidence) => {
    return Math.exp(_confidence + confidenceA) - confidenceB;
  };

  // TODO tune this value
  const makeItEasier = 1.0; // on [0.1,1.0], lower is easier
  const compositionFn = (_rankComponent, _confidenceComponent) => {
    const max = rankFn(bestRank, maxRank) + confidenceFn(bestConfidence);
    const score = _rankComponent + _confidenceComponent;
    return score / (max * makeItEasier);
  };

  rankComponent = rankFn(rank);
  confidenceComponent = confidenceFn(confidence);
  rawRating = compositionFn(rankComponent, confidenceComponent);
  console.log(`Raw rating ${rawRating}, rank component ${rankComponent}, confidence component ${confidenceComponent}.\n` +
              `Inputs: rank ${rank}, confidence ${confidence}`);
  return Math.ceil(clamp(rawRating, minRating, maxRating));
}

function getStarRatingForSketch(sketch) {
  return getStarRating(getRank(sketch), getCorrectLabelConfidence(sketch));
}

export function getSketchScore(sketch) {
  if (!sketch.scores || !sketch.scores.length) {
    console.error('Cant score sketch with no scores. Sketch was:');
    console.error(sketch);
    return 0;
  }
  return getStarRatingForSketch(sketch);
}

function sum(arr) {
  return _.reduce(arr, (sum, score) => {
    return sum + score;
  }, 0);
}

export function getRoundScore(round, player) {
  // TODO refactor to remove dependency on Sketches collection
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
