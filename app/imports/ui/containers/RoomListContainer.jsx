// RoomListContainer
// 
// TODO blurb: responsibilities, relationshiops

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RoomListPage from '../pages/participant/RoomListPage.jsx';

import { Rooms } from '/imports/api/collections/rooms'

export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');
  console.log('RoomListContainer subscribing to data sources');
  return {
    loading: !roomsHandle.ready(),
    rooms: Rooms.find().fetch(),
    noRooms: Rooms.find().count() === 0,
  };
}, RoomListPage);
