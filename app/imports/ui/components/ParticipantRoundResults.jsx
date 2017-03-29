import React from 'react';
import { _ } from 'underscore';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import SketchImage from './SketchImage.jsx';
import PlayerHeader from './PlayerHeader.jsx';
import {
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
      round,
      player,
      sketch,
      getSketchScore,
    } = this.props;

    let rating;
    let scores;
    let loading = false;

    if (!sketch || !sketch.scores || !sketch.scores.length) {
      loading = true;
      rating = 0;
      scores = [{
        'label': `Your ${(sketch && sketch.prompt) || 'sketch'} is being scored.`,
        'confidence': 0.75,
      }, {
        'label': 'The neural network is working.',
        'confidence': 0.5,
      }, {
        'label': 'Thanks for your patience!',
        'confidence': 0.3,
      }];
    } else {
      rating = getSketchScore(sketch);
      // TODO remove: here, we hoist the correct label higher in the list
      // for demo purposes.
      scores = sketch.scores;
      scores.push({
        label: sketch.prompt,
        confidence: 1.00,
      });
    }

    scores.sort((a, b) => b.confidence - a.confidence);
    // TODO refactor TOP_N constant
    const TOP_N = 3;
    const topScores = scores.slice(0, TOP_N);
    const topScoreComponents = topScores.map((score) => {
      const percent = score.confidence * 100;
      let color = 'grey';
      if (score.label === round.prompt) {
        color = 'green';
        // TODO use colors based on confidence
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
          indicating={loading}
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
          <PlayerHeader text={`Round ${round.index+1} (Prompt: ${round.prompt})`} player={player} />
        </Segment>
        <Segment
          loading={loading}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }} >
          <SketchImage 
            sketch={sketch}
            useFrame={true}/>
          <Rating
            icon="star"
            size="massive"
            disabled
            maxRating={5}
            rating={rating} />
        </Segment>
        <Segment>
          <Header as='h3'>SketchNet's best guesses</Header>
          {topScoreComponents}
          <br />
        </Segment>
      </Segment.Group>
    );
  }
}

ParticipantRoundResults.propTypes = {
  round: React.PropTypes.object,
  player: React.PropTypes.object,
  sketch: React.PropTypes.object,
  getSketchScore: React.PropTypes.func,
};
