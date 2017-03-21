import React from 'react';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import {
  getRoundScore,
  getGameScore,
} from '/imports/scoring';

import BaseComponent from './BaseComponent.jsx';
import {
  Container,
  Table,
  Header,
} from 'semantic-ui-react';


export default class ParticipantEndGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      room,
    } = this.props;

    const player = Session.get(PLAYER);

    // TODO compute a score for each player in the room based on their matching sketches
    var renderScores = room.rounds.map(function(round,index) {
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

    return(
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
      </Container>
    );
  }
}

ParticipantEndGameScreen.propTypes = {
  room: React.PropTypes.object,
};
