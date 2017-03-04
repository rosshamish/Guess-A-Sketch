import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class RoomItem extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { room } = this.props;

    return (
      <div className="room">
        I am a room, with id {room.roomID}
      </div>
    );
  }
}

RoomItem.propTypes = {
  room: React.PropTypes.object,
};
