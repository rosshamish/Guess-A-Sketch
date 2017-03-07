import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class Canvas extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
    } = this.props;

    return (
      <div>
        This is where the canvas would be displayed.
      </div>
    );
  }
}

Canvas.propTypes = {
  onTimeout: React.PropTypes.func,
};