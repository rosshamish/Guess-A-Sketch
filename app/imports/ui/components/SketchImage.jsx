import React from 'react';
import BaseComponent from './BaseComponent.jsx';

export default class SketchImage extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { sketch } = this.props;

    if (!sketch) {
      console.error('SketchImage: sketch is undefined');
    }

    const style = {
      width: "300px",
      display: "inline-block"
    };

    return (
      <img style={style} src={sketch.sketch} />
    );
  }
}

SketchImage.propTypes = {
  sketch: React.PropTypes.object,
};
