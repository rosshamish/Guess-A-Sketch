import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from './BaseComponent.jsx';

import { fabric } from 'fabric';

import { Session } from 'meteor/session';
import {
  SKETCH,
} from '/imports/api/session';


export default class Canvas extends BaseComponent {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.pathStack = [];

    this.onUndo = this.onUndo.bind(this);
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.width = 10;
    // this.canvas.freeDrawingBrush.color = ??;

    const canvas = this;
    this.canvas.on('path:created', (event) => {
      canvas.pathStack.push(event.path);
      // Here, we store the sketch to the Session on each mouse-up.
      // Then, in ParticipantGameScreen, when the round changes, we
      // fetch it and send it to the server.
      // TODO Find a better way than using Session
      Session.set(SKETCH, this.canvas.toDataURL());
    });
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
};