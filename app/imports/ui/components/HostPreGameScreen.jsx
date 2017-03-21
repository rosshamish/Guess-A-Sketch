import React from 'react';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import PlayerItem from './PlayerItem.jsx';

import { startRound } from '/imports/api/methods';
import { HOST_ROOM } from '/imports/api/session';

import {
  Container,
  Header,
  Icon,
  Button,
  Form,
  List,
} from 'semantic-ui-react';

export default class HostPreGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onStartGame(event){
    event.preventDefault(); // Don't reload the page
    console.log('Starting Game.');

    const didStartRound = startRound.call({
      room_id: Session.get(HOST_ROOM)._id,
    });
    if (!didStartRound) {
      console.error('Unable to start first round. Server rejected request.');
      return;
    }
  }

  render() {
    const {
      room,
    } = this.props;

    Session.set(HOST_ROOM, room);

    let player_list = '';
    if (room.players.length > 0) {
      player_list = _.map(room.players, (player) => {
        return ( // key suppresses a key error in console
          <PlayerItem key={player.name} player = {player} /> 
        );
      });
    }

    // TO DO: Add animation for people joining the room.
    return (
      <center>
      <Container>
        <Header as="h2" icon textAlign="center">
          <Icon name="sign in" circular />
          <Header.Content>
            Lobby
          </Header.Content>
        </Header>
        <List>
          <List.Item>
            <List.Icon name='tag'/>
            <List.Content><b>Room Name:</b> {room.name}</List.Content>
          </List.Item>
        </List>
        <Form onSubmit={this.onStartGame}>
          <Button type="submit">Start Game</Button>
        </Form>
        <div> {player_list} </div>
      </Container>
      </center>
    );
  }
}

HostPreGameScreen.propTypes = {
  room: React.PropTypes.object,
};
