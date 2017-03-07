import format from 'string-format';

// Stub method
// TODO this will be a Meteor method
// See here https://guide.meteor.com/methods.html
export function joinRoom(room, name) {
  console.log(
    'Pretending to join room ' +
    room.id +
    ' as participant ' +
    name
  );
  Room = room;
  Name = name;
}

// Stub
export function createRoom(room){
  Room = room;
}

// Stub globals
export var Room;
export var Name;
