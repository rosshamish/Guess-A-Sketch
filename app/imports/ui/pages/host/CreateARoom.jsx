import React from 'react';
import { Session } from 'meteor/session';
import { browserHistory } from 'react-router';

import BaseComponent from '../../components/BaseComponent.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

import { Rooms } from '/imports/api/collections/rooms.js';
import { HOST_ROOM } from '/imports/api/session';
import { createRoom } from '/imports/api/methods';

import {
  Form,
  Container,
  Button,
  Header,
} from 'semantic-ui-react';

export default class CreateARoom extends BaseComponent{
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

  onCreateRoom(event){
    event.preventDefault();

    createRoom.call({
      room_name: this.state.roomName,
      round_count: parseInt(this.state.roundCount, 10),
      round_time: parseInt(this.state.roundTime, 10),
    }, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      const room = Rooms.findOne({_id: result});
      if (!room) {
        console.error('Failed to create room.');
        return;
      }
      Session.set(HOST_ROOM, room);
    });
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
      <Container>
        <Header as='h1'>
          <Header.Content>
            Create A Room
          </Header.Content>
        </Header>
        <Form onSubmit={this.onCreateRoom}>
          <Form.Input
            fluid
            inline
            label='Room Name'
            type="text"
            name="roomName"
            ref={(input) => (this.roomName = input)}
            value={this.state.roomName}
            onChange={this.onRoomNameChange}/>
          <Form.Input
            fluid
            inline
            label='Number of Rounds'
            type="number"
            name="roomName"
            value={this.state.roundCount}
            placeholder="Number of Rounds"
            onChange={this.onRoundCountChange}/>
          <Form.Input
            fluid
            inline
            label='Time'
            type="number"
            name="roomName"
            value={this.state.roundTime}
            placeholder="Time"
            onChange={this.onRoundTimeChange}/>
          <Button
            fluid
            primary
            type="submit">
            Create
          </Button>
        </Form>
      </Container>
    );
  }
}

CreateARoom.propTypes = {
  Rooms: React.PropTypes.array,
  loading: React.PropTypes.bool,
}
