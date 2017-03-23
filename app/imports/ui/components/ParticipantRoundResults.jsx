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
  Progress,
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
    const rating = Math.ceil(getRoundScore(round, player) / 100 * 5);

    // TODO use real confidences from sketch net
    const confidences = [['bagel', 0.4], ['button', 0.73], ['apple', 0.21]];
    confidences.sort((a, b) => b[1] - a[1]);
    const confidenceComponents = confidences.map((elems) => {
      const label = elems[0];
      const confidence = elems[1];

      const percent = confidence * 100;
      let color = '';
      if (label === round.prompt) {
        if (percent > 65) {
          color = 'green';
        } else if (percent > 35) {
          color = 'yellow';
        } else {
          color = 'red';
        }
      }
      
      return (
        <Progress
          key={label}
          percent={percent}
          color={color}
          label={label}
        />
      );
    });

    return (
      <Segment.Group>
        <Segment>
          <Header as='h1'>Round {round.index+1}</Header>
        </Segment>
        <Segment style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
           }}>
          <SketchImage 
            sketch={currentPlayerSketch} />
          <Rating 
            size="massive"
            disabled
            maxRating={5}
            rating={rating} />
        </Segment>
        <Segment>
          <Header as='h3'>Guesses</Header>
          {confidenceComponents}
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
