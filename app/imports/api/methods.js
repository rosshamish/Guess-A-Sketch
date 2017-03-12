import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import { Sketches } from './collections/sketches';
import { Rooms } from './collections/rooms';
import { Schema } from './schema';

export const submitSketch = new ValidatedMethod({
  name: 'submitSketch',
  validate: new SimpleSchema({
    sketch: {
      type: Schema.Sketch,
    },
    round_index: {
      type: Number,
    }
  }).validator(),
  run({ sketch }) {
    const sketchID = Sketches.insert(sketch);
    console.log('Inserting sketch ' + sketch);

    Rooms.update({
      "players.name": sketch.player.name,
      "rounds.index": round_index,
    }, {
      "rounds.$": {
        $push: {
          sketches: sketchID,
        },
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
      console.error('Cannot join a non-joinable room. Doing nothing.');
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

export const changeRoomStatus = new ValidatedMethod({
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
    
    // Add the player to the room
    return Rooms.update({
      _id: room_id,
    }, {
      $set: {
        status: room_status,
      },
    });
  },
});

export const changeRoundStatus = new ValidatedMethod({
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
    
    // Add the player to the room
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

    if (!room_name){
        alert('Please fill in a Room Name');
        return;
    } else if (round_count < 1){
        alert('Please allow for at least one round.');
        return;
    } else if (round_time < 10){
        alert('Please give each round at least ten seconds.');
        return;
    } else if (Rooms.find({name: room_name}).fetch().length > 0){ // TO DO: Enforce Uniqueness
        alert('Sorry, that room name is already taken.');
        return;
    }
    
    let rounds = [];
    for (let count = 0; count < round_count; count++){
      rounds.push({time: round_time, index: count});
    }
    let id = Rooms.insert({ name: room_name, rounds: rounds });
    console.log(`Creating room ${room_name} ${id}`);

    return id;
  },
});
