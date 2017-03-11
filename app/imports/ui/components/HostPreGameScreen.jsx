import React from 'react';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import PlayerItem from './PlayerItem.jsx';

import { changeRoomStatus, changeRoundStatus } from '/imports/api/methods';
import { HOST_ROOM } from '/imports/api/session';


export default class HostPreGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onStartGame(event){
    event.preventDefault(); // Don't reload the page
    console.log('Starting Game.');

    let room = Session.get(HOST_ROOM); // TO DO: replace with calls to this.props.room

    // change room status if we're playing for the first time
    if (room.nextRoundIndex == 0){
      const didChangeRoomStatus = changeRoomStatus.call({
        room_id: room._id,
        room_status: "PLAYING"
      });
       if (!didChangeRoomStatus) {
        console.error('Unable to change room status. Server rejected request.');
        return;
      }
    }

    // change round status
    const didChangeRoundStatus = changeRoundStatus.call({
      room_id: room._id,
      round_index: room.nextRoundIndex,
      round_status: "PLAYING"
    });
    if (!didChangeRoundStatus) {
      console.error('Unable to change round status. Server rejected request.');
       return;
    }
  }

  render() {
    const {
      room,
    } = this.props;

    Session.set(HOST_ROOM, room); // TO DO: remove

    let player_list = 'N/A';
    if (room.players.length > 0) {
      player_list = room.players.map(function(player,index) {
        return (
          <PlayerItem 
          key = {player._id}
          player = {player} />
        );
      });
    }

    return (
      <form onSubmit={this.onStartGame}>
        <h3>Welcome!</h3>
        <p>Room Name: {room.name}</p>
        <p>Room Code: {room._id.substring(0, 4)}</p>
        <p>Players in Room: </p>
        <div> {player_list} </div>
        <button type="submit">Start Game</button>
      </form>
    );
  }
}

HostPreGameScreen.propTypes = {
  room: React.PropTypes.object,
};
