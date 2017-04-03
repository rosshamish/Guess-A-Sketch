import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import StackGrid from 'react-stack-grid';
import {
  Container,
  Header,
  Icon,
  Button,
  Form,
  List,
  Label,
} from 'semantic-ui-react';


export default class HostPreGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      room,
      onStartGame,
    } = this.props;

    let playerList = '';
    if (room.players.length > 0) {
      playerList = room.players.map((player) => {
        return ( // key suppresses a key error in console
          <div key={player.name}>
            <Label 
              key={player.name}
              circular
              size="large"
              color={player.color} >
              {player.name}
            </Label>
          </div>
        );
      });
    }

    // generate variable column widths to make player list more interesting
    var columnWidth = "100%"
    if (room.players.length > 15){
      var percent = Math.floor(Math.random() * (40 - 20)) + 20;
      columnWidth = (percent.toString()).concat("%");
    } else if (room.players.length > 3){
      var percent = Math.floor(Math.random() * (70 - 20)) + 20;
      columnWidth = (percent.toString()).concat("%");
    }
    
    return (
      <center>
      <Container>
        <Header as="h1" icon textAlign="center">
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
        <Form 
          onSubmit={(event) => {
            event.preventDefault();
            onStartGame(room);
          }}>
          <Button 
            primary 
            type="submit">
            Start Game
          </Button>
        </Form>
        <br/>
        <StackGrid columnWidth={columnWidth}>
          {playerList}
        </StackGrid>
      </Container>
      </center>
    );
  }
}

HostPreGameScreen.propTypes = {
  room: React.PropTypes.object,
  onStartGame: React.PropTypes.func,
};
