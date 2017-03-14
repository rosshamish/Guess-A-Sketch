import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
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

    return (
      <div className="sketch">
        <img src={sketch.sketch} />
      </div>
    );
  }
}

SketchImage.propTypes = {
  sketch: React.PropTypes.object,
};
