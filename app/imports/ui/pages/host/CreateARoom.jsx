import React from 'react';
import { browserHistory } from 'react-router';

import { Rooms } from '/imports/api/collections/rooms';
import { createRoom } from '/imports/api/methods';
import { gametypes } from '/imports/gametypes';

import { Session } from 'meteor/session';
import { HOST_ROOM } from '/imports/api/session';

import BaseComponent from '../../components/BaseComponent.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import CreateARoomView from './CreateARoomView.jsx';


export default class CreateARoom extends BaseComponent {
  constructor(props){
    super(props);
    this.onCreateRoom = this.onCreateRoom.bind(this);
  }

  onCreateRoom(roomName, roundCount, roundTime) {
    const didSimulateSuccessfully = createRoom.call({
      room_name: roomName,
      round_count: parseInt(roundCount, 10),
      round_time: parseInt(roundTime, 10),
      // TODO control gametype with UI
      gametypeName: 'standard',
    }, (error, roomID) => {
      if (error) {
        console.error(error);
        return;
      }
      const room = Rooms.findOne({_id: roomID});
      if (!room) {
        console.error('Failed to create room.');
        return;
      }
      Session.set(HOST_ROOM, room);
    });
    if (didSimulateSuccessfully) {
      browserHistory.push('/host/play');
    }
  }

  render(){
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
}
