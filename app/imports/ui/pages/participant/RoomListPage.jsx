import React from 'react';
import { browserHistory } from 'react-router';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import { joinRoom } from '/imports/api/methods';

import BaseComponent from '../../components/BaseComponent.jsx';
import RoomListPageView from '../../pages/participant/RoomListPageView.jsx';


export default class RoomListPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onRoomClickHandler(room, event) {
    event.preventDefault();

    const currentPlayer = Session.get(PLAYER);
    if (!currentPlayer) {
      console.error('Failed to join room. No current player.');
      return;
    }

    const didJoinRoom = joinRoom.call({
      room_id: room._id,
      player: currentPlayer,
    });
    if (!didJoinRoom) {
      console.error('Failed to join room. Server rejected join request.');
      return;
    }

    browserHistory.push('/play');
  }

  render() {
    const {
      loading,
      rooms,
    } = this.props;

    const player = Session.get(PLAYER);

    return (
      <RoomListPageView
        loading={loading}
        rooms={rooms}
        player={player}
        onRoomClickHandler={this.onRoomClickHandler}
      />
    );
  }
}

RoomListPage.propTypes = {
  loading: React.PropTypes.bool,
  rooms: React.PropTypes.array,
};
