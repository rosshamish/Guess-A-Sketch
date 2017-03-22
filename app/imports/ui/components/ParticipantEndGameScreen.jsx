import React from 'react';
import { browserHistory } from 'react-router';

import BaseComponent from './BaseComponent.jsx';
import {
  Container,
  Table,
  Header,
  Button,
  Form,
} from 'semantic-ui-react';


export default class ParticipantEndGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
  }

  onSubmit(event) {
    event.preventDefault(); // Don't reload the page
    browserHistory.push('/join');
  }

  render() {
    const {
      room,
      player,
      getRoundScore,
      getGameScore,
    } = this.props;

    // TODO compute a score for each player in the room based on their matching sketches
    let renderScores = room.rounds.map(function(round,index) {
      return ( // key suppresses a key error in console
        <Table.Row key={index}>
          <Table.Cell>{index+1}</Table.Cell>
          <Table.Cell>{getRoundScore(round, player)}</Table.Cell>
        </Table.Row>
      );
    });
    renderScores.push(
      <Table.Row key={room.rounds.length}>
        <Table.Cell>Total</Table.Cell>
        <Table.Cell>{getGameScore(room, player)}</Table.Cell>
      </Table.Row>
    );

    return (
      <Container>
        <Header as="h1">Game Over</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Round</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {renderScores}
          </Table.Body>
        </Table>
        <Form onSubmit={this.onSubmit}>
          <Button type="submit">
            Back to Lobby // PROBLEM: Updates HostEndGameScreen when user leaves
          </Button>
        </Form>
      </Container>
    );
  }
}

ParticipantEndGameScreen.propTypes = {
  room: React.PropTypes.object,
  player: React.PropTypes.object,
  getRoundScore: React.PropTypes.func,
  getGameScore: React.PropTypes.func,
};
