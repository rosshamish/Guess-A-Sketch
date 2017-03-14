// RoomListContainer
// 
// TODO blurb: responsibilities, relationshiops

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import ParticipantGameScreen from '../pages/participant/ParticipantGameScreen.jsx';

import { Rooms } from '/imports/api/collections/rooms';
import { PLAYER } from '/imports/api/session';

export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');
  const sketchesHandle = Meteor.subscribe('sketches.public');

  console.log('ParticipantGameScreenContainer subscribing to data sources');
  const player = Session.get(PLAYER);
  return {
    loading: !(roomsHandle.ready() && sketchesHandle.ready()),
    room: Rooms.findOne({
      players: {
        name: player.name,
        color: player.color,
      },
    }),
  };
}, ParticipantGameScreen);
