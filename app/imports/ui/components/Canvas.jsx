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
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.width = this.state.width;
    this.canvas.freeDrawingBrush.color = this.state.color;
    this.resizeCanvas(this.props);

    // Send a canvas update on:
    // 1. startup, the blank canvas, and
    // 2. each mouse-up, the latest canvas
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(this.canvas);
    }
    const that = this;
    this.canvas.on('path:created', (event) => {
      that.setState({
        pathStack: this.state.pathStack.concat([event.path]),
      });
      if (onChange) {
        onChange(that.canvas, event);
      }
    });
  }

  onUndo(event) {
    event.preventDefault();
    this.canvas.remove(_.last(this.state.pathStack));
    this.setState({
      pathStack: _.initial(this.state.pathStack),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.resizeCanvas(nextProps);
  }

  resizeCanvas(props) {
    this.canvas.setWidth(props.containerWidth);
    // this.canvas.setHeight(props.containerHeight);
  }

  render() {
    const {
      color,
    } = this.props;

    return (
      <Segment.Group>
        <Segment raised color={color || 'black'} >
          <canvas id="canvas" />
        </Segment>
        <Segment disabled={this.state.pathStack.length <= 0}>
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
