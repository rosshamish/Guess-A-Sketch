import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from './BaseComponent.jsx';

import { fabric } from 'fabric';

import { Session } from 'meteor/session';
import {
  SKETCH,
} from '/imports/api/session';


// Attribution: blank PNG data URI
// Source: StackOverflow
// URL: http://stackoverflow.com/a/9967193
// Accessed: March 14, 2017
const blankImg = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export default class Canvas extends BaseComponent {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.pathStack = [];

    this.onUndo = this.onUndo.bind(this);
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('canvas');
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    const height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    this.canvas.setWidth(width * 0.8);
    this.canvas.setHeight(height * 0.8);
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.width = 10;
    // this.canvas.freeDrawingBrush.color = ??;

    const canvas = this;
    Session.set(SKETCH, blankImg);
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
          <canvas style={style} id="canvas" />
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  prompt: React.PropTypes.string,
  player: React.PropTypes.object,
};