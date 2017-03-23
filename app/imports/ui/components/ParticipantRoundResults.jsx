import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import SketchImage from './SketchImage.jsx';
import ParticipantJoiningBetweenRounds from './ParticipantJoiningBetweenRounds.jsx';
import {
  Container,
  Header,
  Segment,
  Rating,
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
    // TODO implement star rating based on real confidence scores
    // Min( 5, Ceil( Max(0, A - Rank) + B( Confidence ) ) )
    // A := 3 or so. Get stars for sketchnet getting it right in the first few guesses.
    // B := fn(confidence-of-correct-label). Get stars for high confidence in the correct label.
    const rating = Math.ceil(getRoundScore(round, player) / 20);

    return (
      <Segment.Group>
        <Segment>
          <Header as='h1'>Round {round.index+1}</Header>
        </Segment>
        <Segment>
          <Rating 
            size="massive"
            disabled
            maxRating={5}
            rating={rating} />
          <SketchImage sketch={currentPlayerSketch} />
          <Header as='h3'>Guesses</Header>
          <div>Button (73%)</div>
          <div>Bagel (40%)</div>
          <div>Globe (21%)</div>
          <br />
        </Segment>
      </Segment.Group>
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
