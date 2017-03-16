export function isPreGame(room) {
  return _.all(room.rounds, (round) => {
    return round.status === 'CREATED';
  });
}

export function isPostGame(room) {
  return room.status === 'COMPLETE';
}

export function isInGame(room) {
  return _.any(room.rounds, (round) => {
    return round.status != 'CREATED';
  });
}

export function currentRound(room) {
  // It's the first round that's not over yet,
  // or if they're all over, it's the last one.
  let round = _.find(room.rounds, (round) => {
    return round.status != 'END';
  });
  if (round) {
    return round;
  } else {
    return _.last(room.rounds);
  }
}

export function roundWantsResults(roundIndex, nextRoom) {
  if (!nextRoom) {
    console.error('Cant look for rounds in an undefined room');
    return null;
  }

  round = _.find(nextRoom.rounds, (round) => {
    return round.index === roundIndex;
  });

  if (!round) {
    console.error('Couldnt find Round #' + roundIndex);
    return null;
  }

  return round.status === 'RESULTS';
}

export function isLastRound(round, room) {
  return round.index == room.rounds.length - 1;
}
