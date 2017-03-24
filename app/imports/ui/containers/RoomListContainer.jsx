import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RoomListPage from '../pages/participant/RoomListPage.jsx';

import { Rooms } from '/imports/api/collections/rooms';


export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');
  const roomsCursor = Rooms.find();
  return {
    loading: !roomsHandle.ready(),
    rooms: roomsCursor.fetch(),
  };
}, RoomListPage);
