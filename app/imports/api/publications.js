import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { _ } from 'underscore';

import { Rooms } from './collections/rooms';
import { Sketches } from './collections/sketches';

// Publishes:
// 1. All rooms, but only the player names in them
Meteor.publish('login.pub', () => Rooms.find({}, { 'players.name': 1 }));

// Publishes:
// 1. Rooms that the player is in, and
// 2. sketches that the player has drawn in that room
publishComposite('participant.pub', (playerName) => {
  return {
    find: () => Rooms.find({ players: { $elemMatch: { name: playerName } } }),
    children: [
      {
        find: (room) => {
          const sketchIDsArrs = _.map(room.rounds, round => round.sketches);
          const sketchIDs = _.reduce(sketchIDsArrs, (soFar, ids) => soFar.concat(ids), []);
          return Sketches.find({
            _id: {
              $in: sketchIDs,
            },
            'player.name': playerName,
          });
        },
      },
    ],
  };
});

// Publishes:
// 1. The room being hosted, and
// 2. Sketches in the room being hosted.
publishComposite('host.pub', (roomName) => {
  return {
    find: () => Rooms.find({ name: roomName }),
    children: [
      {
        find: (room) => {
          const sketchIDsArrs = _.map(room.rounds, round => round.sketches);
          const sketchIDs = _.reduce(sketchIDsArrs, (soFar, ids) => soFar.concat(ids), []);
          return Sketches.find({
            _id: {
              $in: sketchIDs,
            },
          });
        },
      },
    ],
  };
});

// Self-explanatory
Meteor.publish('rooms.all', () => Rooms.find({}));
