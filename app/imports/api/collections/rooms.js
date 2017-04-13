// SRS 3.2.3.1 : Get list of game rooms 
// SRS 3.2.3.9 : Access room information via Room ID 

/**
 * Rooms collection. Insersion/update/deletion can only be allowed
 */

import { Mongo } from  'meteor/mongo';
import { Schema } from '../schema';

export const Rooms = new Mongo.Collection('rooms');
Rooms.attachSchema(Schema.Room);

Rooms.allow({
  insert(userID, doc) {
    return (Rooms.find({
      name: {
        $eq: doc['name'],
      },
    }).count()) === 0;
  },
  update() { return false; },
  remove() { return false; },
});

Rooms.deny({
  // insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
