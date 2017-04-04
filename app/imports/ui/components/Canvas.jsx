import React from 'react';
import { _ } from 'underscore';
import BaseComponent from './BaseComponent.jsx';
import Dimensions from 'react-dimensions';

import { fabric } from 'fabric';
import {
  Segment,
  Button,
  Icon,
} from 'semantic-ui-react';


class CanvasImpl extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      pathStack: [],
      color: props.color,
      width: 5,
    };
    this.canvas = null;

    this.onUndo = this.onUndo.bind(this);
    this.initCanvas = this.initCanvas.bind(this);

    // Prop methods
    if (this.props.onChange) {
      this.onChange = this.props.onChange.bind(this);
    } else {
      this.onChange = () => {};
    }
  }

  componentDidMount() {
    // Send a canvas update on:
    // 1. init, a blank sketch
    // 2. each stroke
    // 3. undo
    const canvas = this.initCanvas('canvas');

    this.onChange(canvas);
    const that = this;
    canvas.on('path:created', (event) => {
      that.setState({
        pathStack: that.state.pathStack.concat([event.path]),
      });
      this.onChange(canvas, event);
    });
  }

  initCanvas(canvasID) {
    this.canvas = new fabric.Canvas(canvasID);
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.width = this.state.width;
    this.canvas.freeDrawingBrush.color = this.state.color;
    this.resizeCanvas(this.props);

    // Grow/shrink the canvas container to fit the viewport
    const containers = document.getElementsByClassName('canvas-container');
    if (!containers || containers.length != 1) {
      console.error('Failed to find a single canvas-container');
    } else {
      const container = containers[0];
      container.style.display = 'flex';
      container.style['flex-direction'] = 'column';
      container.style['flex-grow'] = 1;
    }

    return this.canvas;
  }

  componentWillUnmount() {
    this.canvas.off('path:created');
  }

  onUndo(event) {
    event.preventDefault();
    this.canvas.remove(_.last(this.state.pathStack));
    this.setState({
      pathStack: _.initial(this.state.pathStack),
    });
    this.onChange(this.canvas, event);
  }

  componentWillReceiveProps(nextProps) {
    this.resizeCanvas(nextProps);
  }

  resizeCanvas(props) {
    this.canvas.setWidth(props.containerWidth);
    this.canvas.setHeight(props.containerHeight);
  }

  render() {
    const {
      color,
    } = this.props;

    return (
      <Segment.Group style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <Segment style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              flexGrow: 1,
            }}
            raised
            color={color || 'black'} >
          <canvas id="canvas" />
        </Segment>
        <Segment
          disabled={this.state.pathStack.length <= 0}>
          <Button
            icon
            fluid
            size="large"
            onClick={this.onUndo}
            disabled={this.state.pathStack.length <= 0}
          >
            <Icon name="undo" />
            Undo Stroke
          </Button>
        </Segment>
      </Segment.Group>
    );
  }
}

CanvasImpl.propTypes = {
  onChange: React.PropTypes.func,
  color: React.PropTypes.string,
};

export default Dimensions()(CanvasImpl);
