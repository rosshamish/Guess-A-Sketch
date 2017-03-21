import React from 'react';
import BaseComponent from './BaseComponent.jsx';
import { _ } from 'meteor/underscore';

import { getGameScore } from '/imports/scoring';
import { browserHistory } from 'react-router';

import {
  Container,
  Table,
  Header,
  Button,
  Form,
} from 'semantic-ui-react';

export default class HostEndGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onSubmit(event) {
    event.preventDefault(); // Don't reload the page
    browserHistory.push('/');
  }

  render() {
    const { 
      room,
    } = this.props;
    
    var scores = [];
    players = room.players;
    for (var i in players) {
      scores[scores.length] = {name:players[i].name, score:getGameScore(room, players[i])}
    }
    scores = _.sortBy(scores, 'score').reverse();

    var renderScores = scores.map(function(row,index) {
      return ( // key suppresses a key error in console
        <Table.Row key={index}>
          <Table.Cell>{index+1}</Table.Cell>
          <Table.Cell>{row.name}</Table.Cell>
          <Table.Cell>{row.score}</Table.Cell>
        </Table.Row>
      );
    });

    return(
      <Container>
        <Header as="h1">Game Results</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Rank</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {renderScores}
          </Table.Body>
        </Table>
        <Form onSubmit={this.onSubmit}>
          <Button type="submit">
            Back to Home
          </Button>
        </Form>
      </Container>
    );
  }
}

HostEndGameScreen.propTypes = {
  room: React.PropTypes.object,
};
