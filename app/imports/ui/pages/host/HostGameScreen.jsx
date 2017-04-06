import React from 'react';
import { _ } from 'underscore';

import {
  startRound,
  playRound,
  roundTimerOver,
  endRound,
  endGame,
  errors,
} from '/imports/api/methods';
import { 
  getRoundScore,
  getGameScore,
  getSketchScore,
} from '/imports/scoring';
import {
  isPreGame,
  isPostGame,
  isInGame,
  currentRound,
  isLastRound,
} from '/imports/game-status';

import BaseComponent from '../../components/BaseComponent.jsx';
import GenericLoading from '../../components/GenericLoading.jsx';
import ErrorMessage, { errorCodes } from '../../components/ErrorMessage.jsx';

import HostPreGameScreen from '../../components/HostPreGameScreen.jsx';
import HostPreRound from '../../components/HostPreRound.jsx';
import HostPlayRound from '../../components/HostPlayRound.jsx';
import HostRoundResults from '../../components/HostRoundResults.jsx';
import HostEndGameScreen from '../../components/HostEndGameScreen.jsx';


export default class HostGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
  }

  onStartGame(room) {
    startRound.call({
      room_id: room._id,
    }, (error, result) => {
      if (error) {
        switch (error.error) {
          case errors.startRound.noRoom:
            alert('The room no longer exists');
            break;
          case errors.startRound.roomStatus:
            alert('Failed to set the room status to playing');
            break;
          case errors.startRound.roundStatus:
            alert('Failed to start the round');
            break;
          case errors.ValidationError:
            alert('ValidationError, check console for args.');
            console.error(room);
            break;
        }
      }
    });
  }

  onPlayRound(room) {
    playRound.call({
      room_id: room._id,
    }, (error, result) => {
      if (error) {
        switch (error.error) {
          case errors.playRound.noRoom:
            alert('The room no longer exists');
            break;
          case errors.playRound.roundStatus:
            alert('Failed to start the round');
            break;
          default:
            alert(`Unknown playRound error: ${error.error}`);
        }
      }
    });
  }

  onRoundTimerOver(room) {
    roundTimerOver.call({
      room_id: room._id,
    }, (error, result) => {
      if (error) {
        switch (error.error) {
          case errors.roundTimerOver.noRoom:
            alert('The room no longer exists');
            break;
          case errors.roundTimerOver.roomStatus:
            alert('Failed to set the room status to joinable');
            break;
          case errors.roundTimerOver.roundStatus:
            alert('Failed to set the round to results');
            break;
          default:
            alert(`Unknown roundTimerOver error: ${error.error}`);
        }
      }
    });
  }

  onNextRound(room) {
    const round = currentRound(room);

    endRound.call({
      room_id: room._id,
    }, (error, result) => {
      if (error) {
        switch (error.error) {
          case errors.endRound.noRoom:
            alert('The room no longer exists');
            break;
          case errors.endRound.roomStatus:
            alert('Failed to set the room status to joinable');
            break;
          case errors.endRound.roundStatus:
            alert('Failed to end the round');
            break;
          default:
            alert(`Unknown endRound error: ${error.error}`);
        }
      }
    });

    if (isLastRound(round, room)) {
      endGame.call({
        room_id: room._id,
      }, (error, result) => {
        if (error) {
          switch (error.error) {
            case errors.endGame.noRoom:
              alert('The room no longer exists');
              break;
            case errors.endGame.roomStatus:
              alert('Failed to set the room status to complete');
              break;
            default:
              alert(`Unknown endGame error: ${error.error}`);
          }
        }
      });
    } else {
      startRound.call({
        room_id: room._id,
      }, (error, result) => {
        if (error) {
          switch (error.error) {
            case errors.startRound.noRoom:
              alert('The room no longer exists');
              break;
            case errors.startRound.roomStatus:
              alert('Failed to set the room status');
              break;
            case errors.startRound.roundStatus:
              alert('Failed to start the next round');
              break;
            default:
              alert(`Unknown startRound error: ${error.error}`);
          }
        }
      });
    }
  }

  render() {
    const {
      loading,
      room,
      roomSketches,
    } = this.props;

    // Render components for loading and input validation.
    if (loading) {
      return <GenericLoading />;
    }
    if (!room) {
      return <ErrorMessage code={errorCodes.host.noRoom} />;
    }

    // Pick a component to render based on the state of the game.
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
      const round = currentRound(room);
      if (!round) {
        return <ErrorMessage code={errorCodes.host.noRound} />;
      }
      switch (round.status) {
        case 'PRE':
          return (
            <HostPreRound
              room={room}
              round={currentRound(room)}
              onPlayRound={this.onPlayRound}
            />
          );
        case 'PLAY':
          return (
            <HostPlayRound
              round={round}
              room={room}
              onRoundTimerOver={this.onRoundTimerOver}
            />
          );
        case 'RESULTS':
          const sketches = _.map(round.sketches, (sketchID) => {
            return _.find(roomSketches, (sketch) => sketch._id === sketchID);
          });
          return (
            <HostRoundResults
              room={room}
              round={currentRound(room)}
              sketches={sketches}
              isLastRound={isLastRound}
              onNextRound={this.onNextRound}
              getSketchScore={getSketchScore}
            />
          );
        default :
          return <ErrorMessage code={errorCodes.host.illegalRoundState} />;
      }
    } else {
      return <ErrorMessage code={errorCodes.host.illegalRoomState} />;
    }
  }
}

HostGameScreen.propTypes = {
  loading: React.PropTypes.bool,
  room: React.PropTypes.object,
  roomSketches: React.PropTypes.array,
};
