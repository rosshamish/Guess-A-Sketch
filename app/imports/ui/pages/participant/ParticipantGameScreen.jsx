import React from 'react';
import { Session } from 'meteor/session';
import BaseComponent from '../../components/BaseComponent.jsx';

import Prompt from '../../components/Prompt.jsx';
import Timer from '../../components/Timer.jsx';
import Canvas from '../../components/Canvas.jsx';

import { PLAYER } from '/imports/api/session';

export default class ParticipantGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      sketch: null,
    };
  }

  onTimeout() {
    console.log('onTimeout no-op');
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
      console.log('room: ' + room);
      // The player navigated directly here without joining a room.
      // Don't allow this!
      return (
        <div>
          <p>You must join a room before playing. Go to /join</p>
        </div>
      );
    } else if (room.status === 'JOINABLE' && room.rounds.length === 1) {
      // The game has not started yet.
      return (
        <div>
          <p>You've received the name { Session.get(PLAYER).name }</p>
          <p>You're in room { room.name + ' (' + room._id + ')' }</p>
          <p>Hold your horses though, the game hasn't started yet.</p>
        </div>
      );
    } else if (room.status === 'JOINABLE' && room.rounds.length >= 1) {
      // The game is in-between rounds.
      return (
        <p>In between rounds</p>
      );
    } else if (room.status === 'PLAYING') {
      // A round is in-progress.
      const round = room.rounds[room.rounds.length - 1];
      return (
        <div className="game-screen">
          <div>
            <Prompt prompt={round.prompt} />
            <Timer time={round.time} />
          </div>
          <Canvas onTimeout={this.onTimeout} />
        </div>
      );
    } else {
      // An unsupported state.
      console.error('ParticipantGameScreen in an unsupported room state');
      return (
        <p>Whoops! Something went wrong. Check the console.</p>
      );
    }
  }
}

ParticipantGameScreen.propTypes = {
  loading: React.PropTypes.bool,
  room: React.PropTypes.object,
};
