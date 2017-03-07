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
      onClick,
      text,
    } = this.props;

    return (
      <button className="room" onClick={onClick}>
        {text}
      </button>
    );
  }
}

RoomItem.propTypes = {
  onClick: React.PropTypes.func,
  text: React.PropTypes.string,
};
