import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from '../../components/BaseComponent.jsx';
import { browserHistory } from 'react-router';

import ParticipantPreGameScreen from '../../components/ParticipantPreGameScreen.jsx';
import ParticipantPreRound from '../../components/ParticipantPreRound.jsx';
import ParticipantPlayRound from '../../components/ParticipantPlayRound.jsx';
import ParticipantRoundResults from '../../components/ParticipantRoundResults.jsx';
import ParticipantEndGameScreen from '../../components/ParticipantEndGameScreen.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

import { 
  leaveRoom
} from '/imports/api/methods';

import { Session } from 'meteor/session';
import { 
  PLAYER,
} from '/imports/api/session';

import {
  isPreGame,
  isPostGame,
  isInGame,
  currentRound,
} from '/imports/game-status';


export default class ParticipantGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      sketch: null,
      latestRoundIndex: null,
    };
  }

  componentWillUnmount() {
    // Leave the room, if it exists.
    if (!this.props.room) {
      return;
    } else {
      const didLeaveRoom = leaveRoom.call({
        room_id: this.props.room._id,
        player: Session.get(PLAYER),
      });
      if (!didLeaveRoom) {
        console.error('Failed to leave room.');
        return;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      loading,
      room,
    } = nextProps;

    // Debug reloading
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

    // ---
    // Loading and error handling
    // TODO make these pages pretty.
    // ---
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

    if (isPreGame(room)) {
      return <ParticipantPreGameScreen room={room} />
    } else if (isPostGame(room)) {
      return <ParticipantEndGameScreen room={room} />;
    } else if (isInGame(room)) {
      let round = currentRound(room);
      if (!round) {
        console.error('Theres no current round. What the heck! Something is wrong.');
        return <ErrorMessage />
      }

      if (round.status === 'PRE') {
        return <ParticipantPreRound room={room} round={currentRound(room)} />
      } else if (round.status === 'PLAY') {
        return <ParticipantPlayRound round={round} room={room} />
      } else if (round.status === 'RESULTS') {
        return <ParticipantRoundResults room={room} round={currentRound(room)} />
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

ParticipantGameScreen.propTypes = {
  loading: React.PropTypes.bool,
  room: React.PropTypes.object,
};
