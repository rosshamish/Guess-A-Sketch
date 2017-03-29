import React from 'react';
import BaseComponent from './BaseComponent.jsx';

import SVG from 'svg.js';

const framePath = '/frame.svg';


export default class SketchImage extends BaseComponent {
  constructor(props) {
    super(props);

    const width = 300;
    const height = 200;
    this.draw = null;
    this.state = {
      padding: height*0.3,
      width,
      height,
    };

    this.drawFrameAndSketch = this.drawFrameAndSketch.bind(this);
  }

  drawFrameAndSketch(sketch) {
    const frame = this.draw.group();
    if (sketch) {
      frame
        .image(sketch.sketch, this.sketchWidth(), this.sketchHeight())
        .attr({
          x: this.sketchX(),
          y: this.sketchY(),
        });
    }
    if (this.props.useFrame){
      frame
        .image(framePath, this.containerWidth(), this.containerHeight())
        .attr({
        });
    }
  }

  containerWidth() {
    return this.state.width + this.state.padding;
  }

  containerHeight() {
    return this.state.height + this.state.padding;
  }

  sketchX() {
    return this.state.padding;
  }

  sketchY() {
    return this.state.padding;
  }

  sketchWidth() {
    return this.containerWidth() - this.state.padding*2;
  }

  sketchHeight() {
    return this.containerHeight() - this.state.padding*2;
  }

  componentDidMount() {
    if (this.props.sketch){
      this.draw = SVG(`sketchImage_${this.props.sketch._id}`);
      this.drawFrameAndSketch(this.props.sketch);
    }
  }

  componentDidUpdate() {
    if (!this.draw){
      this.draw = SVG(`sketchImage_${this.props.sketch._id}`);
    }
    this.drawFrameAndSketch(this.props.sketch);
  }

  render() {
    const style = {
      width: `${this.containerWidth()}px`,
      height: `${this.containerHeight()}px`,
      margin: '5px',
    };

    if (this.props.sketch){
      return (
        <div id={`sketchImage_${this.props.sketch._id}`} style={style} />
      );
    } else {
      return (
        <div style={style} />
      );
    }

  }
}

SketchImage.propTypes = {
  sketch: React.PropTypes.object,
  useFrame: React.PropTypes.bool,
};
