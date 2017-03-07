// RoomListContainer
// 
// TODO blurb: responsibilities, relationshiops

import { Meteor } from 'meteor/meteor';
// XXX: Session
// import { Session } from 'meteor/sessoion';
import { createContainer } from 'meteor/react-meteor-data';
import RoomListPage from '../pages/participant/RoomListPage.jsx';

// TODO replace with import { Rooms } when /api/rooms.js is available
import { 
	getRooms,
	getNumRooms,
} from '/imports/api/rooms.js'

export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');
  const usersHandle = Meteor.subscribe('users.public');
  console.log('RoomListContainer subscribing to data sources');
  return {
    loading: roomsHandle.ready() && usersHandle.ready(),
    rooms: getRooms(),
    noRooms: getNumRooms() == 0,
  };
}, RoomListPage);
