import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ParticipantGameScreen from '../pages/participant/ParticipantGameScreen.jsx';

import { Rooms } from '/imports/api/collections/rooms';
import { Sketches } from '/imports/api/collections/sketches';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');
  const sketchesHandle = Meteor.subscribe('sketches.public');

  const player = Session.get(PLAYER);
  let room = null;
  let sketches = [];
  if (player) {
    room = Rooms.findOne({
      players: {
        name: player.name,
        color: player.color,
      }
    });
    sketches = Sketches.find({
      player: {
        name: player.name,
        color: player.color,
      }
    }).fetch();
  }
  return {
    loading: !(roomsHandle.ready() && sketchesHandle.ready()),
    room: room,
    sketches: sketches,
  };
}, ParticipantGameScreen);
