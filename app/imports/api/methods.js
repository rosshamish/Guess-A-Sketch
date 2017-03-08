import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import { Sketches } from './collections/sketches';
import { Rooms } from './collections/rooms';
import { Schema } from './schema';


export const submitSketch = new ValidatedMethod({
  name: 'submitSketch',
  validate: Schema.Sketch.validator(),
  run({ player, sketch, prompt }) {
    const sketchID = Sketches.insert({
      player,
      sketch,
      scores: {},
      prompt,
    });

    Rooms.update({
      players: {
        name: player.name,
        color: player.color,
      },
    }, {
      sketches: {
        $push: {
          sketches: sketchID,
        },
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
    // Add the player to the room
    Rooms.update({
      _id: room_id,
    }, {
      $push: {
        players: player,
      },
    });
  },
});
