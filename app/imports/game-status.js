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

export function isLastRound(round, room) {
  return round.index == room.rounds.length - 1;
}
