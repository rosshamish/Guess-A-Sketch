import React from 'react';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import { Sketches } from '/imports/api/collections/sketches';

import {
  getRoundScore,
} from '/imports/scoring';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import SketchImage from './SketchImage.jsx';
import ParticipantJoiningBetweenRounds from './ParticipantJoiningBetweenRounds.jsx';
import {
  Container,
  Header,
  Segment,
} from 'semantic-ui-react';


export default class ParticipantRoundResults extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      room,
      round,
    } = this.props;

    // TODO more efficient method than fetching ALL sketches and then
    // filtering to the current player's.
    const currentPlayer = Session.get(PLAYER);
    const sketches = _.map(round.sketches, (sketchID) => {
      return Sketches.findOne({ _id: sketchID });
    });
    const currentPlayerSketches = _.filter(sketches, (sketch) => {
      return sketch.player.name === currentPlayer.name;
    });

    if (currentPlayerSketches.length === 0) {
      return <ParticipantJoiningBetweenRounds room={room} round={round} />
    } else if (currentPlayerSketches.length > 1) {
      console.error('Player had too many sketches in latest round. Had ' + currentPlayerSketches.length + '.');
      return <ErrorMessage />
    }

    const currentPlayerSketch = currentPlayerSketches[0];

    return (
      <Container>
        <Header as='h1'>Round Results</Header>
        <Segment.Group>
          <Segment>
            <Header as='h3'>Looks like a... TODO</Header>
            <div>Score: {getRoundScore(round, currentPlayer)}</div>
          </Segment>
          <Segment>
            <SketchImage sketch={currentPlayerSketch} />
          </Segment>
        </Segment.Group>
      </Container>
    );
  }
}

ParticipantRoundResults.propTypes = {
  room: React.PropTypes.object,
  round: React.PropTypes.object,
};
