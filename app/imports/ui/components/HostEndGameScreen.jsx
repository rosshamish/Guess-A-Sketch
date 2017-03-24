import React from 'react';
import { browserHistory } from 'react-router';

import { _ } from 'underscore';

import BaseComponent from './BaseComponent.jsx';
import {
  Segment,
  Table,
  Header,
  Button,
  Form,
  Icon,
} from 'semantic-ui-react';


export default class HostEndGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
  }

  onSubmit(event) {
    event.preventDefault(); // Don't reload the page
    browserHistory.push('/');
  }

  render() {
    const { 
      room,
      getGameScore,
    } = this.props;

    var scores = [];
    const players = room.players;
    for (var i in players) {
      scores[scores.length] = {
        name: players[i].name,
        score: getGameScore(room, players[i])
      };
    }
    scores = _.sortBy(scores, 'score').reverse();

    const renderScores = scores.map(function(row,index) {
      return ( // key suppresses a key error in console
        <Table.Row key={index}>
          <Table.Cell>{index+1}</Table.Cell>
          <Table.Cell>{row.name}</Table.Cell>
          <Table.Cell>{row.score}</Table.Cell>
        </Table.Row>
      );
    });

    return(
      <center>
      <Segment.Group>
        <Segment>
        <Header as="h1" icon textAlign="center">
          <Icon name="trophy" circular />
          <Header.Content>
            Game Results
          </Header.Content>
        </Header>
        </Segment>
        <Segment>
          <Table unstackable>
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
        </Segment>
      </Segment.Group>
      </center>
    );
  }
}

HostEndGameScreen.propTypes = {
  room: React.PropTypes.object,
  getGameScore: React.PropTypes.func,
};
