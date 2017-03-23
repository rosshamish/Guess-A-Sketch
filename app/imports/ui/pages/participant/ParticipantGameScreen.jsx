import React from 'react';
import { _ } from 'meteor/underscore';
import { browserHistory } from 'react-router';

import { Session } from 'meteor/session';
import { PLAYER, SKETCH } from '/imports/api/session';

import { Sketches } from '/imports/api/collections/sketches';

import { leaveRoom, submitSketch } from '/imports/api/methods';
import {
  isPreGame,
  isPostGame,
  isInGame,
  currentRound,
} from '/imports/game-status';
import {
  getRoundScore,
  getGameScore,
} from '/imports/scoring';

import BaseComponent from '../../components/BaseComponent.jsx';
import ParticipantPreGameScreen from '../../components/ParticipantPreGameScreen.jsx';
import ParticipantPreRound from '../../components/ParticipantPreRound.jsx';
import ParticipantPlayRound from '../../components/ParticipantPlayRound.jsx';
import ParticipantRoundResults from '../../components/ParticipantRoundResults.jsx';
import ParticipantEndGameScreen from '../../components/ParticipantEndGameScreen.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';


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

  }

  onCanvasChange(canvas, event) {
    Session.set(SKETCH, canvas.toDataURL());
  }

  onRoundOver(prompt, index) {
    const didSubmitSketch = submitSketch.call({
      sketch: {
        player: Session.get(PLAYER),
        sketch: Session.get(SKETCH),
        prompt: prompt,
      },
      roundIndex: index,
    });
    if (!didSubmitSketch) {
      console.error('Failed to submit sketch');
      return;
    }
  }

  render() {
    const {
      loading,
      room,
    } = this.props;

    const player = Session.get(PLAYER);

    // ---
    // Loading and error handling
    // TODO make these pages pretty.
    // ---
    if (loading) {
      return (
        <p>Loading...</p>
      );
    } else if (!loading && (!room || !player)) {
      console.error('Go back to the homepage. Your session is broken.');
      return <ErrorMessage />;
    }

    if (isPreGame(room)) {
      return (
        <ParticipantPreGameScreen
          room={room}
          player={player}
        />
      );
    } else if (isPostGame(room)) {
      return (
        <ParticipantEndGameScreen
          room={room}
          player={player}
          getRoundScore={getRoundScore}
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
          <ParticipantPreRound
            room={room}
            round={currentRound(room)}
            player={player}
          />
        );
      } else if (round.status === 'PLAY') {
        return (
          <ParticipantPlayRound
            round={round}
            player={player}
            onRoundOver={this.onRoundOver}
            onCanvasChange={this.onCanvasChange}
          />
        );
      } else if (round.status === 'RESULTS') {
        const sketches =_.map(round.sketches, (sketchID) => {
          return Sketches.findOne({ _id: sketchID });
        });
        return (
          <ParticipantRoundResults
            room={room}
            round={currentRound(room)}
            player={player}
            sketches={sketches}
            getRoundScore={getRoundScore}
          />
        );
      } else {
        console.error('[Room ' + room._id + ']: Current round in illegal state');
        return <ErrorMessage />;
      }
    } else {
      console.error('[Room ' + room._id + ']: in illegal state');
      return <ErrorMessage />;
    }
  }
}

ParticipantGameScreen.propTypes = {
  loading: React.PropTypes.bool,
  room: React.PropTypes.object,
};
