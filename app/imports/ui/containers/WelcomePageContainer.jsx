// WelcomePageContainer
// TO DO: add comments

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import WelcomePage from '../pages/host/WelcomePage.jsx';

import { Rooms } from '/imports/api/collections/rooms'
import { HOST_ROOM } from '/imports/api/session';

export default createContainer(() => {
  const roomsHandle = Meteor.subscribe('rooms.public');
  console.log('WelcomePageContainer subscribing to data sources');
  return {
  	room: Session.get(HOST_ROOM),
    loading: !roomsHandle.ready(),
    players: (Rooms.find(Session.get(HOST_ROOM)._id).fetch())[0].players,
  };
}, WelcomePage);
