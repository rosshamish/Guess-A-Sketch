import React from 'react';
import { _ } from 'underscore';

import BaseComponent from './BaseComponent.jsx';
import Canvas from './Canvas.jsx';
import {
  Segment,
  Button,
} from 'semantic-ui-react';

import trimCanvasToSketch from '/imports/trim-canvas';
import { scoreSketch } from '/imports/api/methods';
import { getSketchScore, getSketchRank, getSketchCorrectLabelConfidence } from '/imports/scoring';


export default class SketchnetTuning extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      prompt: 'donut',
      sketch: null,
    };

    this.onCanvasChange = this.onCanvasChange.bind(this);
    this.onScoreSketch = this.onScoreSketch.bind(this);
  }

  render() {
    return (
      <Segment.Group style={{
        height: '70vh',
      }}>
        <Segment>
          <p>
            Use this canvas to tune Sketchnet. The prompt is hard-coded in this file. You'll
            want to change it to what you're trying to draw, so that the star-scoring works properly.
          </p>
          <Button onClick={this.onScoreSketch}>Score it!</Button>
        </Segment>
        <Canvas onChange={this.onCanvasChange} />
      </Segment.Group>
    );
  }

  onCanvasChange(canvas, event) {
    trimCanvasToSketch(canvas, (trimmed, x, y, width, height) => {
      const png = trimmed.toDataURL();
      this.setState({
        sketch: png,
      });
    });
  }

  onScoreSketch() {
    const sketch = this.state.sketch;
    scoreSketch.call({
      sketch: sketch,
    }, (error, scores) => {
      if (error) {
        throw new Error(error);
      }

      if (scores) {
        const sketchObj = {
          player: {},
          sketch: sketch,
          scores: scores,
          prompt: this.state.prompt,
        };
        console.log(`Sketch rating (prompt=${this.state.prompt})`, getSketchScore(sketchObj));
        console.log('Rank:', getSketchRank(sketchObj));
        console.log('Confidence:', getSketchCorrectLabelConfidence(sketchObj));
        scores.sort((a, b) => b.confidence - a.confidence);
        const strScores = _.map(scores, (score) => `${score.label}: ${score.confidence}`);
        console.log('Confidences, sorted:', strScores);
      }
    });
  }
}
