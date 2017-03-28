import React from 'react';
import BaseComponent from './BaseComponent.jsx';

import SVG from 'svg.js';

const framePath = '/frame.svg';


export default class SketchImage extends BaseComponent {
  constructor(props) {
    super(props);

    if (props.useSvg) {
      const svgString = this.props.sketch.svg;
      console.log(svgString);
      let i
      let j;

      i = svgString.indexOf('width="');
      j = svgString.indexOf('" height=');
      const width = parseInt(svgString.substring(i+'width="'.length));

      i = svgString.indexOf('height="');
      j = svgString.indexOf(' viewBox=');
      const height = parseInt(svgString.substring(i+'height="'.length));

      this.state = {
        padding: height*0.15,
        width: width,
        height: height,
      };
    } else {
      const width = 300;
      const height = 200;
      this.state = {
        padding: height*0.3,
        width,
        height,
      };
    }
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

  componentDidMount() {
    this.draw = SVG('sketchImage');

    if (this.props.useSvg) {
      const start = this.props.sketch.svg.indexOf('<path');
      const paths = this.props.sketch.svg.substring(start);
      const frame = this.draw.group();
      frame
        .nested().size(this.sketchWidth(), this.sketchHeight())
        .attr({
          x: this.sketchX(),
          y: this.sketchY(),
        })
        .svg(`${paths}`);
      frame
        .image(framePath, this.containerWidth(), this.containerHeight())
        .attr({
        });
    } else {
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
    }    
  }

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
      <div id='sketchImage' style={style} />
    );
  }
}

SketchImage.propTypes = {
  sketch: React.PropTypes.object,
  useSvg: React.PropTypes.bool,
};
