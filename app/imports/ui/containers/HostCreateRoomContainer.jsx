// HostCreateRoomContainer
// TO DO: add comments

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CreateARoom from '../pages/host/CreateARoom.jsx';

import { Rooms } from '/imports/api/collections/rooms'

export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');

  return {
  	Rooms: Rooms.find({}).fetch(),
    loading: !(roomsHandle.ready()),
  };
}, CreateARoom);
