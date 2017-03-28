import { Meteor } from 'meteor/meteor';
import { _ } from 'underscore';
import { createContainer } from 'meteor/react-meteor-data';
import ParticipantGameScreen from '../pages/participant/ParticipantGameScreen.jsx';

import { Rooms } from '/imports/api/collections/rooms';
import { Sketches } from '/imports/api/collections/sketches';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import { currentRound } from '/imports/game-status';

export default createContainer(() => {
  const player = Session.get(PLAYER);
  const name = (player && player.name) || '';
  const subscription = Meteor.subscribe('participant.pub', name);

  return {
    loading: !(subscription.ready()),
    room: Rooms.findOne({ players: { $elemMatch: { name } } }),
    sketches: Sketches.find({}).fetch(),
    player: player,
  };
}, ParticipantGameScreen);
