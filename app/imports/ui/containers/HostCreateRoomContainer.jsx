// SRS 3.2.2.1 : Creating/Configuring a Room

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CreateARoom from '../pages/host/CreateARoom.jsx';

export default createContainer(() => {
  return {
  };
}, CreateARoom);
