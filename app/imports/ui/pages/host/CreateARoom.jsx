import React from 'react';
import { browserHistory } from 'react-router';

import { Rooms } from '/imports/api/collections/rooms';
import { createRoom } from '/imports/api/methods';

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

  onCreateRoom(room_name, round_count, round_time) {
    const createdRoom = createRoom.call({
      room_name: room_name,
      round_count: parseInt(round_count, 10),
      round_time: parseInt(round_time, 10),
    });

    const room = Rooms.findOne({name: room_name});
    if (!createdRoom || !room) {
      console.error('Failed to create room.');
      return <ErrorMessage />;
    }

    // Navigate to the lobby of the newly created room
    Session.set(HOST_ROOM, room);
    browserHistory.push('/host/play');
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
