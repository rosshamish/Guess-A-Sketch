// RoomListContainer
// 
// TODO blurb: responsibilities, relationshiops

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RoomListPage from '../pages/participant/RoomListPage.jsx';

import { Rooms } from '/imports/api/collections/rooms'

export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');

  const joinableRoomsCursor = Rooms.find({
    status: 'JOINABLE',
  });
  return {
    loading: !roomsHandle.ready(),
    joinableRooms: joinableRoomsCursor.fetch(),
    noJoinableRooms: joinableRoomsCursor.count() === 0,
  };
}, RoomListPage);
