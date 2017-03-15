import React from 'react';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import PlayerItem from './PlayerItem.jsx';

import { startRound } from '/imports/api/methods';
import { HOST_ROOM } from '/imports/api/session';

export default class HostPreGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onStartGame(event){
    event.preventDefault(); // Don't reload the page
    console.log('Starting Game.');

    const didStartRound = startRound.call({
      room_id: Session.get(HOST_ROOM)._id,
    });
    if (!didStartRound) {
      console.error('Unable to start first round. Server rejected request.');
      return;
    }
  }

  render() {
    const {
      room,
    } = this.props;

    Session.set(HOST_ROOM, room);

    let player_list = 'None';
    if (room.players.length > 0) {
      player_list = _.map(room.players, (player) => {
        return ( // key suppresses a key error in console
          <PlayerItem key={player.name} player = {player} /> 
        );
      });
    }

    return (
      <div className="host-pre-game">
        <h1>Lobby</h1>
        <form onSubmit={this.onStartGame}>
          <p>Room Name: {room.name}</p>
          <p>Room Code: {room._id.substring(0, 4)}</p>
          <p>Players in Room: </p>
          <div> {player_list} </div>
          <button type="submit">Start Game</button>
        </form>
      </div>
    );
  }
}

HostPreGameScreen.propTypes = {
  room: React.PropTypes.object,
};
