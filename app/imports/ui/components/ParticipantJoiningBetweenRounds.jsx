import React from 'react';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import {
  Container,
  Header,
  Label,
  Divider,
} from 'semantic-ui-react';


export default class ParticipantJoiningBetweenRounds extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      room,
      round,
    } = this.props;

    const player = Session.get(PLAYER);

    return (
      <Container>
        <Header size="huge">{room.name}</Header>
        <Label 
          circular
          size="large"
          color={player.color}>
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
};
