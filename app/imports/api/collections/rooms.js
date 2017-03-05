/**
 * Rooms collection. Insersion/update/deletion can only be allowed
 */

import { Mongo } from  'meteor/mongo';
import { Schema } from '../schema';

Rooms = new Mongo.Collection('rooms');
Rooms.attachSchema(Schema.Room);


Rooms.allow({
  insert() {return true;},
  update() { return false; },
  remove() { return false; },
});

Rooms.deny({
  // insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
