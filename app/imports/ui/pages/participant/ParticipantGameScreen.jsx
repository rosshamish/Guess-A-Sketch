import React from 'react';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import BaseComponent from '../../components/BaseComponent.jsx';

import ParticipantPreGameScreen from '../../components/ParticipantPreGameScreen.jsx';
import ParticipantPlayRound from '../../components/ParticipantPlayRound.jsx';
import ParticipantRoundResults from '../../components/ParticipantRoundResults.jsx';
import ParticipantEndGameScreen from '../../components/ParticipantEndGameScreen.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

export default class ParticipantGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      sketch: null,
    };

    this.latestRoundStatus = this.currentRound(this.props.room).status;
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.roundHasCompleted(this.props.room, nextProps.room)) {
      const didSubmitSketch = submitSketch.call({
        player: Session.get(PLAYER),
        sketch: Session.get(SKETCH),
        prompt: this.latestCompletedRound(this.props.room).prompt,
      });

      if (!didSubmitSketch) {
        console.error('Failed to submit sketch');
        return;
      }
    }
  }

  roundHasCompleted(room, nextRoom) {
    return this.currentRound(room)._id != this.currentRound(nextRoom)._id;
  }

  gameHasStarted(room) {
    return _.any(room.rounds, (round) => {
      return (
        round.status === 'PLAYING' ||
        round.status === 'COMPLETE'
      );
    });
  }

  gameHasEnded(room) {
    return _.all(room.rounds, (round) => {
      return round.status === 'COMPLETE';
    });
  }

  currentRound(room) {
    return _.find(room.rounds, (round) => {
      return round.status === 'CREATED' || round.status === 'PLAYING';
    });
  }

  latestCompletedRound(room) {
    // Attribution: using slice() to avoid modifying the original array
    // Source: http://stackoverflow.com/questions/30610523/reverse-array-in-javascript-without-mutating-original-array
    // Accessed: March 8, 2017
    return  _.find(room.rounds.slice().reverse(), (round) => {
      return round.status === 'COMPLETE';
    });
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

    // ---
    // Actual page rendering
    // ---
    if (!this.gameHasStarted(room)) {
      return <ParticipantPreGameScreen room={room} />;
    } else if (this.gameHasEnded(room)) {
      return <ParticipantEndGameScreen room={room} />;
    } else {
      const currentRound = this.currentRound();
      if (!currentRound) {
        console.error('Current round is undefined. What the heck! Something is wrong.');
        return <ErrorMessage />
      }

      if (currentRound.status === 'CREATED') {
        // The round has not started yet. We are in-between rounds.
        // So, we want to display results for the *previous* round.
        return <ParticipantRoundResults round={this.latestCompletedRound(room)} />
      } else if (currentRound.status === 'PLAYING') {
        return <ParticipantPlayRound round={currentRound} />
      } else {
        console.error('Current round is in an illegal state');
        return <ErrorMessage />
      }   
    } 
  }
}

ParticipantGameScreen.propTypes = {
  loading: React.PropTypes.bool,
  room: React.PropTypes.object,
};
