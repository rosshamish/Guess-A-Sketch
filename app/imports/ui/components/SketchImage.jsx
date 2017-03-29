import React from 'react';
import BaseComponent from './BaseComponent.jsx';
const framePath = '/frame.svg';


export default class SketchImage extends BaseComponent {
  constructor(props) {
    super(props);

    const width = 300;
    const height = 200;
    this.state = {
      padding: height*0.3,
      width,
      height,
    };
    this.draw = null;
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

/*
  componentDidMount() {
    this.draw = SVG('sketchImage');

    const frame = this.draw.group();
    frame
      .image(this.props.sketch.sketch, this.sketchWidth(), this.sketchHeight())
      .attr({
        x: this.sketchX(),
        y: this.sketchY(),
      });
    frame
      .image(framePath, this.containerWidth(), this.containerHeight())
      .attr({
      });
  }*/

  render() {
    const {
      sketch,
    } = this.props;

    if (!sketch) {
      console.error('SketchImage: sketch is undefined');
    }

    const style = {
      width: `${this.containerWidth()}px`,
      height: `${this.containerHeight()}px`,
      margin: '5px',
    };

    return (
      //<div id='sketchImage' style={style} />
      <img style={style} src={sketch.sketch} />
    );
  }
}

SketchImage.propTypes = {
  sketch: React.PropTypes.object,
};
