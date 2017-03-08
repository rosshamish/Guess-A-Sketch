import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

import { fabric } from 'fabric';

export default class Canvas extends BaseComponent {
  constructor(props) {
    super(props);
    this.canvas = null;
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('canvas');
    console.log(this.canvas);
  }

  render() {
    const {
    } = this.props;

    const style = {
      border: '5px',
      borderColor: 'black',
      borderStyle: 'solid',
    };

    return (
      <div className="container">
        <canvas id="canvas" style={style}/>
      </div>
    );
  }
}

Canvas.propTypes = {
  onTimeout: React.PropTypes.func,
};