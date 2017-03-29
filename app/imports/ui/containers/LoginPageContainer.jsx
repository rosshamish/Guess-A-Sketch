import { Meteor } from 'meteor/meteor';
import { _ } from 'underscore';
import { createContainer } from 'meteor/react-meteor-data';
import LoginPage from '../pages/participant/LoginPage.jsx';

import { Rooms } from '/imports/api/collections/rooms';


export default createContainer(() => {
  const subscription = Meteor.subscribe('login.pub');
  const rooms = Rooms.find({}).fetch();
  const namesInUseArrs = _.map(rooms, room => _.pluck(room.players, 'name'));
  const namesInUse = _.reduce(namesInUseArrs, (soFar, names) => soFar.concat(names), []);
  const joiningNamesInUseArrs = _.map(rooms, room => _.pluck(room.joiningPlayers, 'name'));
  const joiningNamesInUse = _.reduce(joiningNamesInUseArrs, (soFar, names) => soFar.concat(names), []);

  namesInUse.concat(joiningNamesInUse);
  return {
    loading: !(subscription.ready()),
    namesInUse,
  };
}, LoginPage);
