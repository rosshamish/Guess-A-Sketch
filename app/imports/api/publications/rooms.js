import { Meteor } from 'meteor/meteor';

import { 
	Rooms,
} from '../collections/rooms.js'

Meteor.publish('rooms.public', function roomsPublic() {
  console.log('Someone subscribed to rooms.public');
  return Rooms.find();
});
