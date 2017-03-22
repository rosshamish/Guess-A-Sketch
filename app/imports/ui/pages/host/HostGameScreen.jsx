import React from 'react';
import { _ } from 'meteor/underscore';
import { browserHistory } from 'react-router';

import { Session } from 'meteor/session';
import { HOST_ROOM } from '/imports/api/session';

import {
  startRound,
  playRound,
  roundTimerOver,
  endRound,
  endGame,
} from '/imports/api/methods';
import { 
  getRoundScore,
  getGameScore,
} from '/imports/scoring';
import {
  isPreGame,
  isPostGame,
  isInGame,
  currentRound,
  isLastRound,
} from '/imports/game-status';

import BaseComponent from '../../components/BaseComponent.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

import HostPreGameScreen from '../../components/HostPreGameScreen.jsx';
import HostPreRound from '../../components/HostPreRound.jsx';
import HostPlayRound from '../../components/HostPlayRound.jsx';
import HostRoundResults from '../../components/HostRoundResults.jsx';
import HostEndGameScreen from '../../components/HostEndGameScreen.jsx';


export default class HostGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
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

  onStartGame() {
    console.log('Starting Game.');

    const didStartRound = startRound.call({
      room_id: Session.get(HOST_ROOM)._id,
    });
    if (!didStartRound) {
      console.error('Unable to start first round. Server rejected request.');
      return;
    }
  }

  onPlayRound() {
    const didPlayRound = playRound.call({
      room_id: room._id,
    });
    if (!didPlayRound) {
      console.error('Failed to start/play round. Server rejected request.');
      return;
    }
  }

  onRoundTimerOver() {
    const didSucceed = roundTimerOver.call({
      room_id: room._id,
    });
    if (!didSucceed) {
      console.error('Server rejected request.');
      return;
    }
  }

  onNextRound(room) {
    const didEndRound = endRound.call({
      room_id: room._id,
    });
    if (!didEndRound) {
      console.error('Failed to end round. Server rejected request.');
      return;
    }

    if (isLastRound(currentRound(room), room)) {
      const didEndGame = endGame.call({
        room_id: room._id,
      });
      if (!didEndGame) {
        console.error('Unable to end game. Server rejected request.');
        return;
      }
    } else {
      const didStartRound = startRound.call({
        room_id: room._id,
      });
      if (!didStartRound) {
        console.error('Failed to start next round. Server rejected request.');
        return;
      }
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
      return (
        <HostPreGameScreen 
          room={room}
          onStartGame={this.onStartGame}
        />
      );
    } else if (isPostGame(room)) {
      return (
        <HostEndGameScreen
          room={room}
          getGameScore={getGameScore}
        />
      );
    } else if (isInGame(room)) {
      let round = currentRound(room);
      if (!round) {
        console.error('Theres no current round. What the heck! Something is wrong.');
        return <ErrorMessage />
      }

      if (round.status === 'PRE') {
        return (
          <HostPreRound
            room={room}
            round={currentRound(room)}
            playRound={this.onPlayRound}
          />
      } else if (round.status === 'PLAY') {
        return (
          <HostPlayRound
            round={round}
            room={room}
          />
      } else if (round.status === 'RESULTS') {
        const sketches = _.map(round.sketches, (sketchID) => {
          return Sketches.findOne({ _id: sketchID });
        });
        return (
          <HostRoundResults
            room={room}
            round={currentRound(room)}
            sketches={sketches}
            isLastRound={isLastRound}
            onNextRound={this.onNextRound}
          />
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
