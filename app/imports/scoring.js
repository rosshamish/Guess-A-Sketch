import { _ } from 'underscore';
import { Sketches } from '/imports/api/collections/sketches';

function clamp(val, low, high) {
  // Clamps val between low and high, inclusive.
  return Math.max( low, Math.min( val, high) );
}

function sum(arr) {
  return _.reduce(arr, (memo, score) => {
    return memo + score;
  }, 0);
}

function avg(arr) {
  return sum(arr) / arr.length;
}

export function getSketchRank(sketch) {
  const byConfidence = _.sortBy(sketch.scores, s => -1 * s.confidence);
  const labels = _.pluck(byConfidence, 'label');
  const rank = _.indexOf(labels, sketch.prompt);
  if (rank === -1) {
    return sketch.scores.length;
  }
  return rank;
}

export function getSketchCorrectLabelConfidence(sketch) {
  const score = _.find(sketch.scores, s => s.label === sketch.prompt);
  if (!score) {
    return 0;
  }
  return score.confidence;
}

export function getStarRating(rank, confidence) {
  let rawRating;
  const maxRating = 5;
  const minRating = 1;

  // Give points for the rank of the correct label.
  // rank := position of label in the scores list when sorted by confidence.
  let rankComponent;
  const bestRank = 0;
  const maxRank = 250;
  const rankTop = 40;
  const rFn = (val) => Math.log(1 + val);
  const rankFn = (rank) => {
    return rFn(clamp((rankTop - rank) / rankTop, 0, 1));
  };

  // Give points for how confident we were about the correct label.
  // how confident := confidence on [0,1]
  let confidenceComponent;
  const bestConfidence = 1;
  const confidenceA = 1;
  const confidenceB = 7;
  const cFn = (val) => Math.log(1 + val);
  const confidenceFn = (_confidence) => {
    return cFn(clamp(_confidence, 0, 1));
  };

  // TODO tune this value
  const makeItEasier = 1.1; // on [0.1,1.0], lower is easier
  const compositionFn = (_rankComponent, _confidenceComponent) => {
    const maxRankScore = rankFn(bestRank);
    const maxConfidenceScore = confidenceFn(bestConfidence);
    const rankRating = maxRating * (_rankComponent / (maxRankScore * makeItEasier));
    const confidenceRating = maxRating * (_confidenceComponent / (maxConfidenceScore * makeItEasier));
    return (rankRating + confidenceRating) / 2;
  };

  rankComponent = rankFn(rank);
  confidenceComponent = confidenceFn(confidence);
  rawRating = compositionFn(rankComponent, confidenceComponent);
  return Math.ceil(clamp(rawRating, minRating, maxRating));
}

function getStarRatingForSketch(sketch) {
  const sumOfConfidences = sum(_.pluck(sketch.scores, 'confidence'));
  if (sumOfConfidences === 0) {
    // 0 stars for an empty sketch.
    return 0;
  }
  return getStarRating(getSketchRank(sketch), getSketchCorrectLabelConfidence(sketch));
}

export function getSketchScore(sketch) {
  if (!sketch.scores || !sketch.scores.length) {
    console.error('Cant score sketch with no scores. Sketch was:');
    console.error(sketch);
    return 0;
  }
  return getStarRatingForSketch(sketch);
}

export function getRoundScore(round, player) {
  // TODO refactor to remove dependency on Sketches collection
  const sketches = _.map(round.sketches, (sketchID) => Sketches.findOne(sketchID));
  const byPlayer = _.filter(sketches, (sketch) => 
      sketch.player.name === player.name,
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
  const roundScores = _.map(room.rounds, (round) => {
    return getRoundScore(round, player);
  });
  return Math.ceil(avg(roundScores));
}
