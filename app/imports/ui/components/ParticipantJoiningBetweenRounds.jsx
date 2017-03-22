import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import {
  Container,
  Header,
  Label,
  Divider,
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
      <Container>
        <Header size="huge">{room.name}</Header>
        <Label
          circular
          size="large"
          color={player.color}
        >
          {player.name}
        </Label>

        <Divider />

        <p>You're in! You'll play in the next round.</p>
      </Container>
    );
  }
}

ParticipantJoiningBetweenRounds.propTypes = {
  room: React.PropTypes.object,
  round: React.PropTypes.object,
  player: React.PropTypes.object,
};
