// TODO use this file for mock debugging data
// See the example file at https://github.com/meteor/todos/blob/react/imports/startup/server/fixtures.js

import { Meteor } from 'meteor/meteor';
import { Rooms } from '../../api/collections/rooms.js';

DEBUG = true;

Meteor.startup(() => {
  console.log('Adding fake test data (fixtures.js)');

  if (Rooms.find().count() === 0 || DEBUG === true) {
    const rooms = [
      {
        name: 'Cool kids only',
        rounds: [{time: 10}],
        players: [],
        status: 'JOINABLE',
      },
      {
        name: 'Smart kids only',
        rounds: [{time: 10}],
        players: [],
        status: 'JOINABLE',
      },
      {
        name: 'Short people only',
        rounds: [{time: 10}],
        players: [],
        status: 'JOINABLE',
      },
      {
        name: 'An in progress game',
        rounds: [{time: 10}],
        players: [],
        status: 'PLAYING',
      },
      {
        name: 'A completed game',
        rounds: [{time: 10}],
        players: [],
        status: 'COMPLETE',
      },
    ];

    Rooms.remove({});
    rooms.forEach((room) => {
      console.log('Inserting room ' + room.name);
      Rooms.insert(room);
    });
  }
});
