import React from 'react';
import { _ } from 'underscore';

import { Session } from 'meteor/session';
import { PLAYER, SKETCH_PNG, SKETCH_SVG } from '/imports/api/session';

import { leaveRoom, submitSketch, errors } from '/imports/api/methods';
import { isPreGame, isPostGame, isInGame, currentRound } from '/imports/game-status';
import { getSketchScore, getRoundScore, getGameScore } from '/imports/scoring';
import trimCanvasToSketch from '/imports/trim-canvas';

import BaseComponent from '../../components/BaseComponent.jsx';
import ParticipantPreGameScreen from '../../components/ParticipantPreGameScreen.jsx';
import ParticipantPreRound from '../../components/ParticipantPreRound.jsx';
import ParticipantPlayRound from '../../components/ParticipantPlayRound.jsx';
import ParticipantJoiningBetweenRounds from '../../components/ParticipantJoiningBetweenRounds.jsx';
import ParticipantRoundResults from '../../components/ParticipantRoundResults.jsx';
import ParticipantEndGameScreen from '../../components/ParticipantEndGameScreen.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';


export default class ParticipantGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    // Leave the room, if it exists.
    if (this.props.room && this.props.player) {
      leaveRoom.call({
        room_id: this.props.room._id,
        player: this.props.player,
      }, (error, result) => {
        if (error) {
          switch (error.error) {
            case errors.leaveRoom.noRoom:
              alert('The room no longer exists');
              break;
            case errors.leaveRoom.playerNotInRoom:
              alert('Failed to leave the room, you were never in it');
              break;
            case errors.leaveRoom.pullPlayer:
              alert('Failed to remove you from the room');
              break;
            default:
              alert(`Unknown leaveRoom error: ${error.error}`);
          }
        }
      });
    }
  }

  onCanvasChange(canvas, event) {
    trimCanvasToSketch(canvas, (trimmed, x, y, width, height) => {
      const png = trimmed.toDataURL();
      Session.set(SKETCH_PNG, png);
      canvas.clone((cloned) => {
        const svg = cloned.toSVG({
          suppressPreamble: true,
        });
        Session.set(SKETCH_SVG, svg);
      });
    });
  }

  onRoundOver(prompt, index) {
    submitSketch.call({
      player: Session.get(PLAYER),
      sketch: Session.get(SKETCH_PNG),
      prompt,
      roundIndex: index,
    }, (error, result) => {
      if (error) {
        switch (error.error) {
          case errors.submitSketch.insertFailure:
            alert('Sorry! Failed to add your sketch.');
            break;
          case errors.submitSketch.scoreUpdateFailure:
            alert('Sorry! Failed to score your sketch.');
            break;
          default:
            alert(`Unknown submitSketch error: ${error.error}`);
        }
      }
    });
  }

  render() {
    const {
      loading,
      room,
      sketches,
      player,
      isWaiting,
    } = this.props;

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
        return <ErrorMessage />;
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
        if (isWaiting) {
          return (
            <ParticipantJoiningBetweenRounds
              room={room}
              round={currentRound(room)}
              player={player}
            />
          );
        } else {
          const sketch = _.find(sketches, s => _.contains(round.sketches, s._id));
          return (
            <ParticipantRoundResults
              round={currentRound(room)}
              player={player}
              sketch={sketch}
              getSketchScore={getSketchScore}
            />
          );
        }
      } else {
        // TODO bugfix: this case hits very briefly at the end of each round.
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
  sketches: React.PropTypes.array,
  player: React.PropTypes.object,
  isWaiting: React.PropTypes.bool,
};
