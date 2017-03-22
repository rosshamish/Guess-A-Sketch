import React from 'react';
import BaseComponent from './BaseComponent.jsx';

import { fabric } from 'fabric';
import {
  Container,
  Button,
  Icon,
} from 'semantic-ui-react';

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

    // Send a canvas update on:
    // 1. startup, the blank canvas, and
    // 2. each mouse-up, the latest canvas
    const canvas = this;
    this.props.onChange && this.props.onChange(this.canvas, event);
    this.canvas.on('path:created', (event) => {
      canvas.pathStack.push(event.path);
      this.props.onChange && this.props.onChange(this.canvas, event);
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
      onChange
    } = this.props;

    const style = {
      border: '1px',
      borderColor: 'black',
      borderStyle: 'solid',
    };

    const buttonStyle = {
      position: 'relative',
      bottom: '47px',
      left: '10px',
    };

    return (
      <Container fluid>
        <div className="container">
          <canvas style={style} id="canvas" />
        </div>
        <Button 
          style={buttonStyle}
          icon
          size="big"
          onClick={this.onUndo}
        >
          <Icon name="undo" />
          Undo Stroke
        </Button>
      </Container>
    );
  }
}

Canvas.propTypes = {
  prompt: React.PropTypes.string,
  player: React.PropTypes.object,
  onChange: React.PropTypes.func,
};