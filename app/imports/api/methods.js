import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import { Sketches } from './collections/sketches';
import { Rooms } from './collections/rooms';
import { 
  Schema,
  getFakePrompt, // TODO fetch prompts from sketch net
} from './schema';

import {
  currentRound,
} from '../game-status';


export const submitSketch = new ValidatedMethod({
  name: 'submitSketch',
  validate: new SimpleSchema({
    sketch: {
      type: Schema.Sketch,
    },
    roundIndex: {
      type: Number,
    },
  }).validator(),
  run({ sketch, roundIndex }) {
    const sketchID = Sketches.insert(sketch);
    console.log('Submitting sketch ' + sketchID);

    return Rooms.update({
      "players.name": sketch.player.name,
      "rounds.index": roundIndex,
    }, {
      "$push": {
        "rounds.$.sketches": sketchID,
      },
    });
  },
});

export const leaveRoom = new ValidatedMethod({
  name: 'leaveRoom',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
    player: {
      type: Schema.Player,
    },
  }).validator(),
  run({ room_id, player }) {
    const room = Rooms.findOne({
      _id: room_id,
    });

    const playerInRoom = _.find(room.players, (existingPlayer) => {
      return existingPlayer.name === player.name;
    });
    if (!playerInRoom) {
      console.error('Cannot leave room. Player was never in the room.');
      return false;
    }

    // Remove the player from the room
    return Rooms.update({
      _id: room_id,
    }, {
      $pull: {
        players: player,
      },
    });
  },
});

export const joinRoom = new ValidatedMethod({
  name: 'joinRoom',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
    player: {
      type: Schema.Player,
    },
  }).validator(),
  run({ room_id, player }) {
    const room = Rooms.findOne({
      _id: room_id,
    });

    if (room.status != 'JOINABLE') {
      alert('Cannot join a non-joinable room. Doing nothing.');
      return false;
    }

    const playerNameUnique = _.every(room.players, (existingPlayer) => {
      return existingPlayer.name != player.name;
    });
    if (!playerNameUnique) {
      // TODO tell the user this in the UI
      console.error('Cannot join room. Name must be unique.');
      return false;
    }
    
    // Add the player to the room
    return Rooms.update({
      _id: room_id,
    }, {
      $push: {
        players: player,
      },
    });
  },
});

export const startRound = new ValidatedMethod({
  name: 'startRound',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    let room = Rooms.findOne({
      _id: room_id
    });
    if (!room) {
      console.error('Unable to find room with id ' + room_id);
      return;
    }

    const didChangeRoomStatus = changeRoomStatus.call({
      room_id: room_id,
      room_status: 'PLAYING'
    });
    if (!didChangeRoomStatus) {
      console.error('Failed to change room status.');
      return didChangeRoomStatus;
    }

    const didChangeRoundStatus = changeRoundStatus.call({
      room_id: room_id,
      round_index: currentRound(room).index,
      round_status: 'PRE',
    });
    if (!didChangeRoundStatus) {
      console.error('Failed to change round status.');
      return didChangeRoundStatus;
    }

    return true; // Success
  },
});


export const playRound = new ValidatedMethod({
  name: 'playRound',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    let room = Rooms.findOne({
      _id: room_id
    });
    if (!room) {
      console.error('Unable to find room with id ' + room_id);
      return;
    }

    const didChangeRoundStatus = changeRoundStatus.call({
      room_id: room_id,
      round_index: currentRound(room).index,
      round_status: 'PLAY'
    });
    if (!didChangeRoundStatus) {
      console.error('Failed to change round status.');
      return didChangeRoundStatus;
    }
    return true; // Success
  },
});

export const roundTimerOver = new ValidatedMethod({
  name: 'roundTimerOver',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    let room = Rooms.findOne({
      _id: room_id
    });
    if (!room) {
      console.error('Unable to find room with id ' + room_id);
      return;
    }

    const didChangeRoomStatus = changeRoomStatus.call({
      room_id: room_id,
      room_status: 'JOINABLE'
    });
    if (!didChangeRoomStatus) {
      console.error('Failed to change room status.');
      return didChangeRoomStatus;
    }

    const didChangeRoundStatus = changeRoundStatus.call({
      room_id: room_id,
      round_index: currentRound(room).index,
      round_status: 'RESULTS'
    });
    if (!didChangeRoundStatus) {
      console.error('Failed to change round status.');
      return didChangeRoundStatus;
    }

    return true; // Success
  },
});

export const endRound = new ValidatedMethod({
  name: 'endRound',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    let room = Rooms.findOne({
      _id: room_id
    });
    if (!room) {
      console.error('Unable to find room with id ' + room_id);
      return;
    }

    const didChangeRoundStatus = changeRoundStatus.call({
      room_id: room_id,
      round_index: currentRound(room).index,
      round_status: 'END'
    });
    if (!didChangeRoundStatus) {
      console.error('Failed to change round status.');
      return didChangeRoundStatus;
    }

    return true; // Success
  },
});


export const endGame = new ValidatedMethod({
  name: 'endGame',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    const didChangeRoomStatus = changeRoomStatus.call({
      room_id: room_id,
      room_status: 'COMPLETE'
    });
    if (!didChangeRoomStatus) {
      console.error('Unable to change room status.');
      return;
    }

    return true; // Success
  },
});


const changeRoomStatus = new ValidatedMethod({
  name: 'changeRoomStatus',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
    room_status: {
      type: String,
    },
  }).validator(),
  run({ room_id, room_status }) {
    const room = Rooms.findOne({
      _id: room_id,
    });
    
    console.log('[Room ' + room_id + ']: is now ' + room_status);
    return Rooms.update({
      _id: room_id,
    }, {
      $set: {
        status: room_status,
      },
    });
  },
});

const changeRoundStatus = new ValidatedMethod({
  name: 'changeRoundStatus',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
    round_index: {
      type: Number,
    },
    round_status: {
      type: String,
    },
  }).validator(),
  run({ room_id, round_index, round_status }) {
    const room = Rooms.findOne({
      _id: room_id,
    });
    
    console.log('[Room ' + room_id + ']: Round ' + round_index + ' is now ' + round_status);
    return Rooms.update({
      _id: room_id,
      "rounds.index": round_index
    }, {
      $set:{
        "rounds.$.status": round_status
      },
    });
  },
});


export const createRoom = new ValidatedMethod({
  name: 'createRoom',
  validate: new SimpleSchema({
    room_name: {
      type: String,
    },
    round_count: {
      type: Number,
    },
    round_time: {
      type: Number,
    },
  }).validator(),
  run({ room_name, round_count, round_time }) {

    // Problem: Rooms.find({}) doesn't return ANY rooms, even the test ones
    // that are definitely there. Therefore, we cannot check for name uniqueness.

    if (!room_name){
        alert('Please fill in a Room Name');
        return;
    } else if (round_count < 1){
        alert('Please allow for at least one round.');
        return;
    } else if (round_time < 10){
        alert('Please give each round at least ten seconds.');
        return;
    } else if (Rooms.find({name: room_name}).fetch().length > 0){ 
        alert('Sorry, that room name is already taken.');
        return;
    }
    
    let rounds = [];
    for (let count = 0; count < round_count; count++){
      rounds.push({
        time: round_time,
        index: count,
        prompt: getFakePrompt(),
      });
    }
    let id = Rooms.insert({ name: room_name, rounds: rounds });
    console.log(`Creating room ${room_name} ${id}`);

    return id;
  },
});
