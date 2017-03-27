import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RoomListPage from '../pages/participant/RoomListPage.jsx';

import { Rooms } from '/imports/api/collections/rooms';

export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.all');
  return {
    loading: !(roomsHandle.ready()),
    rooms: Rooms.find().fetch(),
  };
}, RoomListPage);
