import { Meteor } from 'meteor/meteor';

import { Rooms } from './collections/rooms';
import { Players } from './collections/players';

Meteor.publish('rooms.public', () => {
  console.log('Someone subscribed to rooms.public');
  return Rooms.find();
});

Meteor.publish('players.public', () => {
  console.log('Someone subscribed to players.public');
  return Players.find();
});
