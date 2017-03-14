import { Meteor } from 'meteor/meteor';

import { Rooms } from './collections/rooms';
import { Sketches } from './collections/sketches';

Meteor.publish('rooms.public', () => {
  console.log('Someone subscribed to rooms.public');
  return Rooms.find();
});

Meteor.publish('sketches.public', () => {
  console.log('Someone subscribed to sketches.public');
  return Sketches.find();
});
