import React from 'react';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import BaseComponent from '../../components/BaseComponent.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

import HostPreGameScreen from '../../components/HostPreGameScreen.jsx';
import HostEndGameScreen from '../../components/HostEndGameScreen.jsx';
import HostPlayRound from '../../components/HostPlayRound.jsx';
import HostRoundResults from '../../components/HostRoundResults.jsx';

import {
  roundHasCompleted,
  gameHasStarted,
  gameHasEnded,
  currentRound,
  latestCompletedRound
} from '/imports/game-status';

export default class HostGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      loading,
      room,
    } = this.props;

    if (loading) {
      return (
        <p>Loading...</p>
      );
    } else if (!room) {
      // The player navigated directly here without joining a room.
      // Don't allow this!
      console.error('Error: room is undefined.');
      return <ErrorMessage />
    }

    // Page Rendering
    if (!gameHasStarted(room)) {
      return <HostPreGameScreen room={room} />
    } else if (gameHasEnded(room)) {
      return <HostEndGameScreen room={room} />;
    } else {
      let round = currentRound(room);
      if (!round) {
        console.error('Current round is undefined. What the heck! Something is wrong.');
        return <ErrorMessage />
      }

      if (round.status === 'CREATED') {
        // The round has not started yet. We are in-between rounds.
        // So, we want to display collage results for the *previous* round.
        return <HostRoundResults round = {latestCompletedRound(room)} />
      } else if (round.status === 'PLAYING') {
        return <HostPlayRound
          round={round}
          room={room} />
      } else {
        console.error('Current round is in an illegal state');
        return <ErrorMessage />
      }
    } 
  }
}

HostGameScreen.propTypes = {
  loading: React.PropTypes.bool,
  room: React.PropTypes.object,
};
