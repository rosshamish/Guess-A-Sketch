// WelcomePageContainer
// TO DO: add comments

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import HostGameScreen from '../pages/host/HostGameScreen.jsx';

import { Rooms } from '/imports/api/collections/rooms'
import { HOST_ROOM } from '/imports/api/session';

export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');

  console.log('WelcomePageContainer subscribing to data sources');

  return {
  	room: Rooms.findOne({_id : Session.get(HOST_ROOM)._id}),
    loading: !roomsHandle.ready(),
  };
}, HostGameScreen);
