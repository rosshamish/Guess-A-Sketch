import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import { Players } from './collections/players';
import { Rooms } from './collections/rooms';
import { Schema } from './schema';

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
    // Add the player to our list of players
    Players.insert(player);

    // Add the player to the room
    // TODO add the player's _id to the room for normalization
    Rooms.update({
      _id: room_id,
    }, {
      // TODO append the player instead of replacing the list
      $push: {
        players: player,
      },
    });
  },
});
