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
    },
  }).validator(),
  run({ sketch, round_index }) {
    const sketchID = Sketches.insert(sketch);

    Rooms.update({
      "players.name": sketch.player.name,
      "rounds.prompt": sketch.prompt,
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
