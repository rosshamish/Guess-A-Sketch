import React from 'react';

import BaseComponent from '../../components/BaseComponent.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import CreateARoomView from './CreateARoomView.jsx';


export default class CreateARoomView extends BaseComponent{
  constructor(props){
    super(props);
    this.state = {
      roomName: 'test' + Math.floor((Math.random() * 100) + 1), // make room name random
      roundCount: 2, // set to 10
      roundTime: 10, // set to 20
    };

    this.onRoomNameChange = this.onRoomNameChange.bind(this);
    this.onRoundCountChange = this.onRoundCountChange.bind(this);
    this.onRoundTimeChange = this.onRoundTimeChange.bind(this);
    this.onCreateRoom = this.onCreateRoom.bind(this);
  }

  onRoomNameChange(event){
      this.setState({roomName: event.target.value});
  }

  onRoundCountChange(event){
      this.setState({roundCount: event.target.value});
  }

  onRoundTimeChange(event){
      this.setState({roundTime: event.target.value});
  }

  onCreateRoom(room_name, round_count, round_time){
    event.preventDefault();

    const createdRoom = createRoom.call({
      room_name: room_name,
      round_count: parseInt(round_count),
      round_time: parseInt(round_time)
    });

    const room = Rooms.findOne({name: room_name});
    if (!createdRoom || !room) {
      console.error('Failed to create room.');
      return <ErrorMessage />
    }

    // Navigate to the lobby of the newly created room
    Session.set(HOST_ROOM, room);
    browserHistory.push('/host/play');
  }

  render(){
    const {
      loading,
      room,
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
  Rooms: React.PropTypes.array,
  loading: React.PropTypes.bool,
}
