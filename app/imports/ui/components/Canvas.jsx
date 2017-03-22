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
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(canvas);
    }
    const that = this;
    this.canvas.on('path:created', (event) => {
      that.pathStack.push(event.path);
      if (onChange) {
        onChange(that.canvas, event);
      }
    });
  }

  onUndo(event) {
    event.preventDefault();
    this.canvas.remove(this.pathStack.pop());
  }

  render() {
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
  onChange: React.PropTypes.func,
};