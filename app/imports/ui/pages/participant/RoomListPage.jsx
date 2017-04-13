// SRS 3.2.1.1 : Joining a Room
// SRS 3.2.1.6 : (Error) No Rooms Exist

import React from 'react';
import { browserHistory } from 'react-router';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import { joinRoom, errors } from '/imports/api/methods';

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

    joinRoom.call({
      room_id: room._id,
      player: currentPlayer,
    }, (error, result) => {
      if (error) {
        switch (error.error) {
          case errors.joinRoom.noRoom:
            alert('The room no longer exists');
            break;
          case errors.joinRoom.joinability:
            alert('The room is not joinable');
            break;
          case errors.joinRoom.uniqueName:
            alert('Sorry! Someone in that room took your name. Try again with a new name.');
            break;
          case errors.joinRoom.pushPlayer:
            alert('Sorry, failed to add you to the room');
            break;
          default:
            alert(`Unknown joinRoom error: ${error.error}`);
        }
      } else {
        browserHistory.push('/play');
      }
    });
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
