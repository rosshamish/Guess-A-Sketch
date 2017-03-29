import React from 'react';
import { browserHistory } from 'react-router';

import { Rooms } from '/imports/api/collections/rooms';
import { createRoom, errors } from '/imports/api/methods';

import { Session } from 'meteor/session';
import { HOST_ROOM } from '/imports/api/session';

import BaseComponent from '../../components/BaseComponent.jsx';
import CreateARoomView from './CreateARoomView.jsx';


export default class CreateARoom extends BaseComponent {
  constructor(props) {
    super(props);
    this.onCreateRoom = this.onCreateRoom.bind(this);
  }

  onCreateRoom(roomName, roundCount, roundTime) {
    createRoom.call({
      room_name: roomName,
      round_count: parseInt(roundCount, 10),
      round_time: parseInt(roundTime, 10),
      // TODO control gametype with UI
      gametypeName: 'standard',
    }, (error, roomID) => {
      if (error) {
        switch (error.error) {
          case errors.createRoom.noName:
            alert('Please enter a room name');
            break;
          case errors.createRoom.uniqueName:
            alert('Sorry, that room name is already taken.');
            break;
          case errors.createRoom.roundCount:
            alert(error.reason);
            break;
          case errors.createRoom.roundTime:
            alert(error.reason);
            break;
          case errors.createRoom.gametype:
            alert('Gametype error. Check the gametype being used.');
            break;
          case errors.createRoom.insertRoom:
            alert('Failed to create the room, try again.');
            break;
          default:
            alert(`Unknown createRoom error: ${error.error}`);
        }
      } else {
        Session.set(HOST_ROOM, roomName);
        browserHistory.push('/host/play');
      }
    });
  }

  render() {
    const {
      loading,
    } = this.props;

    return (
      <CreateARoomView
        loading={loading}
        onCreateRoom={this.onCreateRoom}
      />
    );
  }
}

CreateARoom.propTypes = {
  loading: React.PropTypes.bool,
};
