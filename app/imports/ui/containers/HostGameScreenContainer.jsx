// WelcomePageContainer
// TO DO: add comments

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Session } from 'meteor/session';
import { HOST_ROOM } from '/imports/api/session';

import { Rooms } from '/imports/api/collections/rooms';
import { Sketches } from '/imports/api/collections/sketches';

import HostGameScreen from '../pages/host/HostGameScreen.jsx';


export default createContainer(() => {
  const roomName = Session.get(HOST_ROOM);
  const subscription = Meteor.subscribe('host.pub', roomName);
  return {
    loading: !(subscription.ready()),
    room: Rooms.findOne({ name: roomName }),
    roomSketches: Sketches.find({}).fetch(),
  };
}, HostGameScreen);
