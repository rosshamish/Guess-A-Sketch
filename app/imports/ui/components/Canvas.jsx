import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from './BaseComponent.jsx';

import { fabric } from 'fabric';
import { submitSketch } from '/imports/api/methods';


export default class Canvas extends BaseComponent {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.pathStack = [];

    this.onUndo = this.onUndo.bind(this);
    this.onTimeout = this.onTimeout.bind(this);
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.width = 10;
    // this.canvas.freeDrawingBrush.color = ??;

    const canvas = this;
    this.canvas.on('path:created', (event) => {
      canvas.pathStack.push(event.path);
    });
  }

  onTimeout(event) {
    event.preventDefault();
    const base64sketch = this.canvas.toDataURL();
    submitSketch.call({
      player: this.props.player,
      sketch: base64sketch,
      prompt: this.props.prompt,
    })

    console.log(base64sketch);
  }

  onUndo(event) {
    event.preventDefault();
    this.canvas.remove(this.pathStack.pop());
  }

  render() {
    const {
      prompt,
      player,
    } = this.props;

    const style = {
      border: '5px',
      borderColor: 'black',
      borderStyle: 'solid',
    };

    return (
      <div>
        <button onClick={this.onUndo}>Undo Stroke</button>
        <button onClick={this.onTimeout}>Time's Up!</button>
        <div className="container">
          <canvas id="canvas" style={style} />
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  prompt: React.PropTypes.string,
  player: React.PropTypes.object,
  onTimeout: React.PropTypes.func,
};