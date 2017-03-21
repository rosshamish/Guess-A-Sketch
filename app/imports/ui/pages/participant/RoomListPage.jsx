import React from 'react';
import { Session } from 'meteor/session';
import { browserHistory } from 'react-router';
import { _ } from 'meteor/underscore';

import BaseComponent from '../../components/BaseComponent.jsx';
import RoomItem from '../../components/RoomItem.jsx';
import NoRooms from '../../components/NoRooms.jsx';

import { joinRoom } from '/imports/api/methods';
import { PLAYER } from '/imports/api/session';

import {
} from 'semantic-ui-react';


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
      joinableRooms,
      noJoinableRooms,
    } = this.props;

    if (noJoinableRooms) {
      return <NoRooms />
    } else if (loading) {
      return <h3>Loading...</h3>;
    } else {
      if (!joinableRooms) {
        console.error('Can\'t display room list: rooms is undefined');
        return <ErrorMessage />
      }

      const page = this;
      let roomItems = _.map(joinableRooms, (room) => {
        return (
          <Card.Group
            key={room._id}
            onClick={page.onRoomClickHandler.bind(page, room)}
            room={room}
          />
        );
      });

      return (
        <div>
          <h1>Join a room</h1>
          <div className="room-list">{roomItems}</div>
          <p>Don't see your room? Don't worry! You can join between rounds.</p>
        </div>
      );
    }
  }
}

RoomListPage.propTypes = {
  loading: React.PropTypes.bool,
  joinableRooms: React.PropTypes.array,
  noJoinableRooms: React.PropTypes.bool,
};
