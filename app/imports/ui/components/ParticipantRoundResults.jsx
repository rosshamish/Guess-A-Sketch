import React from 'react';

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
  }

  render() {
    const {
      room,
      round,
      player,
      sketches,
      getRoundScore,
    } = this.props;

    // TODO more efficient method than fetching ALL sketches and then
    // filtering to the current player's.
    const currentPlayerSketches = sketches.filter((sketch) =>
      sketch.player.name === player.name
    );

    if (currentPlayerSketches.length === 0) {
      return (
        <ParticipantJoiningBetweenRounds
          room={room}
          round={round}
          player={player}
        />
      );
    } else if (currentPlayerSketches.length > 1) {
      console.error('Player had too many sketches in latest round. Had ' + currentPlayerSketches.length + '.');
      return <ErrorMessage />
    }

    const currentPlayerSketch = currentPlayerSketches[0];

    return (
      <Container>
        <Header as='h1'>Round {round.index+1} Over</Header>
        <Segment.Group>
          <Segment>
            <Header as='h3'>Looks like a... TODO</Header>
            <div>Score: {getRoundScore(round, player)}</div>
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
  player: React.PropTypes.object,
  sketches: React.PropTypes.array,
  getRoundScore: React.PropTypes.func,
};
