// Use this file for mock debugging data
// See the example file at https://github.com/meteor/todos/blob/react/imports/startup/server/fixtures.js

import { Meteor } from 'meteor/meteor';
import { Rooms } from '../../api/collections/rooms.js';

const DEBUG = false;

Meteor.startup(() => {
  console.log('Adding fake test data (fixtures.js)');

  if (Rooms.find().count() === 0 || DEBUG === true) {
    const rooms = [
      {
        name: 'Only smarties (one rounds)',
        rounds: [
          {time: 10, index: 0},
        ],
        players: [],
        status: 'JOINABLE',
      },
      {
        name: 'Only canadians (two rounds)',
        rounds: [
          {time: 10, index: 0},
          {time: 20, index: 1},
        ],
        players: [],
        status: 'JOINABLE',
      },
      {
        name: 'In progress',
        rounds: [{time: 10, index: 3}],
        players: [],
        status: 'PLAYING',
      },
      {
        name: 'Completed',
        rounds: [{time: 10, index: 4}],
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
