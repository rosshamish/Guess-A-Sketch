import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Canvas from './Canvas.jsx';
import {
  Container,
  Header,
  Label,
  Divider,
  Segment,
} from 'semantic-ui-react';


export default class ParticipantJoiningBetweenRounds extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      room,
      player,
    } = this.props;

    return (
      <Segment.Group>
        <Segment>
          <Header size="huge">
            {room.name}
            <Label
              circular
              size="large"
              color={player.color}>
              {player.name}
            </Label>
          </Header>
        </Segment>
        <Segment>
          <p>You're in! You'll play in the next round.</p>
          <p>Feel free to draw while you wait!</p>
          <Canvas color={player.color} />
        </Segment>
      </Segment.Group>
    );
  }
}

ParticipantJoiningBetweenRounds.propTypes = {
  room: React.PropTypes.object,
  round: React.PropTypes.object,
  player: React.PropTypes.object,
};
