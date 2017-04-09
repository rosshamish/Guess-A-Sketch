import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import SketchImage from './SketchImage.jsx';
import SketchRating from './SketchRating.jsx';
import {
  Header,
  Segment,
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
        label: `Your ${(sketch && sketch.prompt) || 'sketch'} is being scored.`,
        confidence: 0.75,
      }, {
        label: 'The neural network is working.',
        confidence: 0.5,
      }, {
        label: 'Thanks for your patience!',
        confidence: 0.3,
      }];
    } else {
      rating = getSketchScore(sketch);
      scores = sketch.scores;
    }

    scores.sort((a, b) => b.confidence - a.confidence);
    const TOP_N = 3;
    const topScores = scores.slice(0, TOP_N);
    const topScoreComponents = topScores.map((score) => {
      const percent = score.confidence * 100;
      let color = 'grey';
      if (score.label === round.prompt) {
        color = 'green';
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

    // Attribution: Greg Dean
    // Title: Convert string to title case with JavaScript
    // Url: http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
    // Accessed: March 29, 2017
    var str = round.prompt;
    var capitalizedPrompt = str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

    return (
      <Segment.Group>
        <Segment
          loading={loading}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Header as='h1'>"{capitalizedPrompt}" by {player.name}</Header>
          <SketchImage 
            sketch={sketch}
            useFrame
          />
          <SketchRating
            rating={rating}
          />
        </Segment>
        <Segment>
          <Header as='h3'>SketchNet's Top {TOP_N} Guesses</Header>
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
