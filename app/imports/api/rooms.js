import { Session } from 'meteor/session';
import { PLAYER } from './session';
import { Players } from './collections/players';
import { Rooms } from './collections/rooms';

// Stub method
// TODO this will be a Meteor method
// See here https://guide.meteor.com/methods.html
export function joinRoom(room, name) {
  console.log('Joining room ' + room._id + ' as participant ' + name);

  const player = {
    name: name,
    color: 'red', // TODO support color
  };

  // Add the player to our list of players
  Players.insert(player);

  // Add the player to the room
  Rooms.update({
    _id: room._id,
  }, {
    $push: {
      players: player,
    }
  });

  // Set the current player, client-side, so we can refer to ourself later
  Session.set(PLAYER, player);
}

// Stub
export function createRoom(room){
  Room = room;
}

// Stub globals
export var Room;
export var Name;
