export function roundHasCompleted(latestRoundStatus, nextRoom) {
  console.log('roundHasCompleted(' + latestRoundStatus + ', ' + currentRound(nextRoom).status);
	return (
    latestRoundStatus === 'PLAYING' &&
    currentRound(nextRoom).status === 'CREATED'
  );
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
  return  _.find(room.rounds.slice().reverse(), (round) => {
    return round.status === 'COMPLETE';
  });
}
