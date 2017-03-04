import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

import RoomItem from '../../components/RoomItem.jsx';

export default class RoomListPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      rooms,
      loading
    } = this.props;

    let Rooms;
    if (!rooms || !rooms.length) {
      Rooms = (
        <h3>No Rooms Available</h3>
      );
    } else {
      Rooms = rooms.map(room => (
        <RoomItem room={room} />
      ));
    }

    return Rooms;
  }
}

RoomListPage.propTypes = {
  rooms: React.PropTypes.array,
};
