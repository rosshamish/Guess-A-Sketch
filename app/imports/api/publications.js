import { Meteor } from 'meteor/meteor';

import { Rooms } from './collections/rooms';

Meteor.publish('rooms.public', () => {
  console.log('Someone subscribed to rooms.public');
  return Rooms.find();
});
