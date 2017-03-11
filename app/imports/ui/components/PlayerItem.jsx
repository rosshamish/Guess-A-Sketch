import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class RoomItem extends BaseComponent {
    constructor(props) {
        super(props);
    }

  render() {
    const {
      text,
    } = this.props;

    return (
      <p>{text}</p>
    );
  }
}

RoomItem.propTypes = {
  text: React.PropTypes.string,
};
