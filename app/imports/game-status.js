export function roundHasCompleted(roundIndex, nextRoom) {
  if (!nextRoom) {
    console.error('roundHasCompleted received null nextRoom');
    return null;
  }

  round = _.find(nextRoom.rounds, (round) => {
    return round.index === roundIndex;
  })

  if (!round) {
    console.error('No round exists with index ' + roundIndex);
    return null;
  } else {
    return round.status === 'COMPLETE';
  }
}

export function gameHasStarted(room) {
  return _.any(room.rounds, (round) => {
    return (
      round.status === 'PLAYING' ||
      round.status === 'COMPLETE'
    );
  });
}

export function gameHasEnded(room) {
  return _.all(room.rounds, (round) => {
    return round.status === 'COMPLETE';
  });
}

export function currentRound(room) {
  return _.find(room.rounds, (round) => {
    return round.status === 'CREATED' || round.status === 'PLAYING';
  });
}

export function latestCompletedRound(room) {
  // Attribution: using slice() to avoid modifying the original array
  // Source: http://stackoverflow.com/questions/30610523/reverse-array-in-javascript-without-mutating-original-array
  // Accessed: March 8, 2017
  completed = _.filter(room.rounds, (round) => {
    return round.status === 'COMPLETE';
  });
  if (completed.length > 0) {
    return completed[0];
  } else {
    return null;
  }
}
