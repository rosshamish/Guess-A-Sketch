import React from 'react';
import { Session } from 'meteor/session';
import { browserHistory } from 'react-router';

import BaseComponent from '../../components/BaseComponent.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

import { Rooms } from '/imports/api/collections/rooms.js';
import { HOST_ROOM } from '/imports/api/session';
import { createRoom } from '/imports/api/methods';

import { Form } from 'semantic-ui-react'

export default class CreateARoom extends BaseComponent{
  constructor(props){
    super(props);
    this.state = {
      roomName: 'apple', // testing vars: to be deleted
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

  onCreateRoom(event){
    event.preventDefault();

    const createdRoom = createRoom.call({
      room_name: this.state.roomName,
      round_count: parseInt(this.state.roundCount),
      round_time: parseInt(this.state.roundTime)
    });

    let room = Rooms.findOne({name: this.state.roomName});
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

    if (loading) {
      return (
        <p>Loading...</p>
    );}

    return (
      <center>
        <div className="create-room">
          <h1>Create a room</h1>
          <form onSubmit={this.onCreateRoom}>

            Room Name:
            <input
              type="text"
              name="roomName"
              ref={(input) => (this.roomName = input)}
              value={this.state.roomName}
              placeholder="Room Name"
              onChange={this.onRoomNameChange}/>
            <br/>

            Number of Rounds:
            <input
              type="number"
              name="roomName"
              value={this.state.roundCount}
              placeholder="Number of Rounds"
              onChange={this.onRoundCountChange}/>
            <br/>

            Time:
            <input
              type="number"
              name="roomName"
              value={this.state.roundTime}
              placeholder="Time"
              onChange={this.onRoundTimeChange}/>
            <br/>

            <button className="ui button">
              Create
            </button>
          </form>
        </div>
      </center>
    );
  }
}

CreateARoom.propTypes = {
  Rooms: React.PropTypes.array,
  loading: React.PropTypes.bool,
}
