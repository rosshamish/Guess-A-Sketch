import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import SketchImage from './SketchImage.jsx';
import ParticipantJoiningBetweenRounds from './ParticipantJoiningBetweenRounds.jsx';
import PlayerHeader from './PlayerHeader.jsx';
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
    // TODO loading screen while sketch is scored
    if (!currentPlayerSketch.scores || !currentPlayerSketch.scores.length) {
      return <p>Loading...</p>;
    }

    const rating = getRoundScore(round, player);

    currentPlayerSketch.scores.sort((a, b) => b.confidence - a.confidence);
    // TODO refactor TOP_N constant
    const TOP_N = 3;
    const topScores = currentPlayerSketch.scores.slice(0, TOP_N);
    const topScoreComponents = topScores.map((score) => {
      const percent = score.confidence * 100;
      let color = 'grey';
      if (score.label === round.prompt) {
        color = 'green';
        // TODO alternate colors based on confidence
        // if (percent > 65) {
        //   color = 'green';
        // } else if (percent > 35) {
        //   color = 'yellow';
        // } else {
        //   color = 'red';
        // }
      }
      
      return (
        <Progress
          key={score.label}
          percent={percent}
          color={color}
          label={score.label}
        />
      );
    });

    return (
      <Segment.Group>
        <Segment>
          <PlayerHeader text={`Round ${round.index+1}`} player={player} />
        </Segment>
        <Segment style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
           }}>
          <SketchImage 
            sketch={currentPlayerSketch} />
          <Rating
            icon="star"
            size="massive"
            disabled
            maxRating={5}
            rating={rating} />
        </Segment>
        <Segment>
          <Header as='h3'>Looks like...</Header>
          {topScoreComponents}
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
