// WelcomePageContainer
// TO DO: add comments

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Session } from 'meteor/session';
import { HOST_ROOM } from '/imports/api/session';

import { Rooms } from '/imports/api/collections/rooms';

import HostGameScreen from '../pages/host/HostGameScreen.jsx';


export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');
  const sketchesHandle = Meteor.subscribe('sketches.public');

  const room = Session.get(HOST_ROOM);
  return {
    loading: !(roomsHandle.ready() && sketchesHandle.ready()),
    room: room ? Rooms.findOne({_id : room._id}) : null,
  };
}, HostGameScreen);
