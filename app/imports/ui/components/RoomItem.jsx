import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from './BaseComponent.jsx';

export default class RoomItem extends BaseComponent {
    constructor(props) {
      super(props);
    }

  render() {
    const {
      onClick,
      room,
    } = this.props;

    return (
      <button className="room" onClick={onClick}>
        {room.name + ' (' + room._id.substring(0, 4) + ')'}
      </button>
    );
  }
}

RoomItem.propTypes = {
  onClick: React.PropTypes.func,
  room: React.PropTypes.object,
};
