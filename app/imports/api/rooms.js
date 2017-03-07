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

// Stub methods
// TODO these will be helper methods on a Rooms Collection
// See it with Lists here https://github.com/meteor/todos/blob/react/imports/api/lists/methods.js
export function getNumRooms() {
  return 4;
}

export function getRooms() {
  return [
    {
      id: 'ABCD',
    },
    {
      id: '1234',
    },
    {
      id: 'HELO',
    },
    {
      id: 'WORL'
    }
  ];
}
