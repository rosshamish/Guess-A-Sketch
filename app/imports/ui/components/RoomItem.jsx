import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from './BaseComponent.jsx';

import {
  Card,
} from 'semantic-ui-react';


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
      <Card onClick={onClick}>
        <Card.Content>
          <Card.Header>
            {room.name}
          </Card.Header>
          <Card.Meta>
            {room.status}
          </Card.Meta>
          <Card.Description>
            {room.players.length + ' players'}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

RoomItem.propTypes = {
  onClick: React.PropTypes.func,
  room: React.PropTypes.object,
};
