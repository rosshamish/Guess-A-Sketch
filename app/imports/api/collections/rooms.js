/**
 * Rooms collection. Insersion/update/deletion can only be allowed
 */

import { Mongo } from  'meteor/mongo';
import {Schema} from '../schema';

Rooms = new Mongo.Collection('rooms');
Rooms.attachSchema(Schema.Room);


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
