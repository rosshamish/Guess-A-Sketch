import React from 'react';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import { browserHistory } from 'react-router';

import BaseComponent from '../../components/BaseComponent.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

import HostPreGameScreen from '../../components/HostPreGameScreen.jsx';
import HostPreRound from '../../components/HostPreRound.jsx';
import HostPlayRound from '../../components/HostPlayRound.jsx';
import HostRoundResults from '../../components/HostRoundResults.jsx';
import HostEndGameScreen from '../../components/HostEndGameScreen.jsx';

import {
  isPreGame,
  isPostGame,
  isInGame,
  currentRound,
} from '/imports/game-status';

export default class HostGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const {
      loading,
      room,
    } = nextProps;

    if (!loading && !room) {
      console.error('Room undefined. Redirecting.');
      browserHistory.push('/');
      return;
    }
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
      // The player navigated directly here without creating a room.
      // Don't allow this!
      console.error('Error: room is undefined.');
      return <ErrorMessage />
    }

    // Page Rendering
    if (isPreGame(room)) {
      return <HostPreGameScreen room={room} />
    } else if (isPostGame(room)) {
      return <HostEndGameScreen room={room} />;
    } else if (isInGame(room)) {
      let round = currentRound(room);
      if (!round) {
        console.error('Theres no current round. What the heck! Something is wrong.');
        return <ErrorMessage />
      }

      if (round.status === 'PRE') {
        return <HostPreRound room={room} round={currentRound(room)} />
      } else if (round.status === 'PLAY') {
        return <HostPlayRound round={round} room={room} />
      } else if (round.status === 'RESULTS') {
        return <HostRoundResults room={room} round={currentRound(room)} />
      } else {
        console.error('[Room ' + room._id + ']: Current round in illegal state');
        return <ErrorMessage />
      }
    } else {
      console.error('[Room ' + room._id + ']: in illegal state');
      return <ErrorMessage />
    }
  }
}

HostGameScreen.propTypes = {
  loading: React.PropTypes.bool,
  room: React.PropTypes.object,
};
