import { Meteor } from 'meteor/meteor';

import { Rooms } from './collections/rooms';
import { Sketches } from './collections/sketches';

Meteor.publish('rooms.public', () => {
  return Rooms.find();
});

Meteor.publish('sketches.public', () => {
  return Sketches.find();
});
