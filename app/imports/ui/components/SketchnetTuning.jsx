import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Canvas from './Canvas.jsx';
import {
  Label,
  Container,
  Header,
  Divider,
  Segment,
} from 'semantic-ui-react';

import trimCanvasToSketch from '/imports/trim-canvas';
import { scoreSketch } from '/imports/api/methods';
import { getSketchScore } from '/imports/scoring';


export default class SketchnetTuning extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      prompt: 'donut',
    };

    this.onCanvasChange = this.onCanvasChange.bind(this);
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
        </Segment>
        <Canvas color={null} onChange={this.onCanvasChange} />
      </Segment.Group>
    );
  }

  onCanvasChange(canvas) {
    trimCanvasToSketch(canvas, (trimmed, x, y, width, height) => {
      const png = trimmed.toDataURL();
      scoreSketch.call({
        sketch: png,
      }, function(error, scores) {
        if (error) {
          throw new Error(error);
        }

        if (scores) {
          const sketch = {
            player: {},
            sketch: png,
            scores: scores,
            prompt: this.state.prompt,
          };
          console.log('Sketch rating', getSketchScore(sketch));
          scores.sort((a, b) => b.confidence - a.confidence);
          console.log('Raw confidences, sorted', scores);
        } else {
          console.log('null scores');
        }
      });
    });
  }
}
