/**
 * Rooms collection. Insersion/update/deletion can only be allowed
 */

import { Mongo } from  'meteor/mongo';
// import {Players} from 'players';

Rooms = new Mongo.Collection('rooms');
// Rooms = new SimpleSchema({
//   roomID: { type: String, regEx: SimpleSchema.RegEx.Id },
//   name: { type: String },
//   rounds: { type: [Rounds.schema], minCount: 1 },
//   players: { type: [Players.schema], defaultValue: [] },
//   status: { type: String, allowedValues: ['CREATED', 'PLAYING', 'COMPLETE'] },
// });


Rooms.allow({
  insert() {
    // unique_name = (Rooms.find({ name: { $exists: true, $in: [name] } }).count() === 0);
    // valid_rounds = roundCount > 0;
    //
    // if (!unique_name) {
    //   console.log('Name not unique');
    // }
    // if (!valid_rounds) {
    //   console.log('Number of rounds <= 0 !!');
    // }

    // return unique_name & valid_rounds;
    return true;
      // Rooms.insert({name, roundCount, complete: Symbol('COMPLETE')})
  },
  update() { return false; },
  remove() { return false; },
});

Rooms.deny({
  // insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
