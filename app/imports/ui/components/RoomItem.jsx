import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import {
  Card,
  Label,
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

    const playerBubbles = room.players.map(player => (
      <Label key={player.name} color={player.color} />
    ));

    return (
      <Card onClick={onClick ? onClick.bind(null, room) : undefined}>
        <Card.Content>
          <Card.Header>
            {room.name}
          </Card.Header>
          <Card.Meta>
            {room.status}
          </Card.Meta>
          <Card.Description>
            {playerBubbles}
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
