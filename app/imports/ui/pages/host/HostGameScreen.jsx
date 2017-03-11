import React from 'react';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import { browserHistory } from 'react-router';

import BaseComponent from '../../components/BaseComponent.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

import PlayerItem from '../../components/PlayerItem.jsx';
import HostPreGameScreen from '../../components/HostPreGameScreen.jsx';
import HostEndGameScreen from '../../components/HostEndGameScreen.jsx';
import HostPlayRound from '../../components/HostPlayRound.jsx';
import HostRoundResults from '../../components/HostRoundResults.jsx';

import { HOST_ROOM } from '/imports/api/session';

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
        const currRound = currentRound(room);
        if (!currRound) {
          console.error('Current round is undefined. What the heck! Something is wrong.');
          return <ErrorMessage />
        }

        if (currRound.status === 'CREATED') {
          // The round has not started yet. We are in-between rounds.
          // So, we want to display collage results for the *previous* round.
          return <HostRoundResults round={latestCompletedRound(room)} />
        } else if (currRound.status === 'PLAYING') {
          return <HostPlayRound round={currRound} />
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
