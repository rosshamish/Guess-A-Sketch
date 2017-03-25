import { prompts as sPrompts } from './sketch-net';

// Standard gametype.
// N rounds, each the same length of time.
// Picks randomly from all prompts.
const standard = {
  defaults: {
    _numRounds: 5,
    _roundTime: 25,
    _prompts: sPrompts.standard,
  },
  rounds: ({ _numRounds, _roundTime, _prompts }) => {
    const numRounds = _numRounds || standard.defaults._numRounds;
    const roundTime = _roundTime || standard.defaults._roundTime;
    const prompts = _prompts || standard.defaults._prompts;
    const rounds = [];
    for (let i = 0; i < numRounds; i++){
      rounds.push({
        time: roundTime,
        index: i,
        // Random choice without replacement
        prompt: prompts.splice(Math.floor(Math.random() * prompts.length), 1)[0],
      });
    }
    return rounds;
  },
};

// Playtest 1
// 3-7 minutes
// 5 rounds of varying lengths.
const playtest1 = {
  defaults: {
    _numRounds: 5,
    _roundTimes: [25, 25, 25, 40, 40],
    _prompts: sPrompts.playtest1,
  },
  rounds: ({ _numRounds, _roundTimes, _prompts }) => {
    const numRounds = _numRounds || playtest1.defaults._numRounds;
    const roundTimes = _roundTimes || playtest1.defaults._roundTimes;
    const prompts = _prompts || playtest1.defaults._prompts;
    const rounds = [];
    for (let i = 0; i < numRounds; i++){
      rounds.push({
        time: roundTimes[i],
        index: i,
        prompt: prompts[i],
      });
    }
    return rounds;
  },
};

// Playtest 2
// 4 minutes
// Food, 5 rounds.
const playtest2 = {
  defaults: {
    _numRounds: 5,
    _roundTime: standard.defaults._roundTime,
    _prompts: sPrompts.food,
  },
  rounds: ({ _numRounds, _roundTime, _prompts }) => {
    const numRounds = _numRounds || playtest2.defaults._numRounds;
    const roundTime = _roundTime || playtest2.defaults._roundTime;
    const prompts = _prompts || playtest2.defaults._prompts;
    const rounds = [];
    for (let i = 0; i < numRounds; i++){
      rounds.push({
        time: roundTime,
        index: i,
        // Random choice without replacement
        prompt: prompts.splice(Math.floor(Math.random() * prompts.length), 1)[0],
      });
    }
    return rounds;
  },
};

// Playtest 3
// 5 minutes
// Lightning rounds with easy prompts.
// Starts off slow.
const playtest3 = {
  defaults: {
    _numRounds: 7,
    _roundTimes: [25, 25, 20, 15, 15, 10, 5],
    _prompts: sPrompts.easy,
  },
  rounds: ({ _numRounds, _roundTimes, _prompts }) => {
    const numRounds = _numRounds || playtest3.defaults._numRounds;
    const roundTimes = _roundTimes || playtest3.defaults._roundTimes;
    const prompts = _prompts || playtest3.defaults._prompts;
    const rounds = [];
    for (let i = 0; i < numRounds; i++){
      rounds.push({
        time: roundTimes[i],
        index: i,
        // Random choice without replacement
        prompt: prompts.splice(Math.floor(Math.random() * prompts.length), 1)[0],
      });
    }
    return rounds;
  },
};

// Playtest 4
// 5 minutes
// Animals, 5 rounds, longer drawing time.
// "The big leagues"
const playtest4 = {
  defaults: {
    _numRounds: 5,
    _roundTime: 40,
    _prompts: sPrompts.animals,
  },
  rounds: ({ _numRounds, _roundTime, _prompts }) => {
    const numRounds = _numRounds || playtest4.defaults._numRounds;
    const roundTime = _roundTime || playtest4.defaults._roundTime;
    const prompts = _prompts || playtest4.defaults._prompts;
    const rounds = [];
    for (let i = 0; i < numRounds; i++){
      rounds.push({
        time: roundTime,
        index: i,
        // Random choice without replacement
        prompt: prompts.splice(Math.floor(Math.random() * prompts.length), 1)[0],
      });
    }
    return rounds;
  },
};

export const gametypes = {
  standard,
  playtest1,
  playtest2,
  playtest3,
  playtest4,
};
export default function gametype(name, params) {
  const gt = gametypes[name];
  if (!gt) {
    throw Error(`No gametype found named ${name}`);
  }
  const toPass = params || gt.defaults;
  const rounds = gt.rounds(toPass);
  return { name, rounds };
}

