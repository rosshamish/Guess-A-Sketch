import React from 'react';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Canvas from './Canvas.jsx';
import Timer from './Timer.jsx';
import {
  Header,
  Container,
} from 'semantic-ui-react';


export default class ParticipantPreRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      round,
      room,
    } = this.props;

    return (
      <Container>
        <Header as='h1'>Round {round.index + 1}</Header>
        <Container>
          <Prompt prompt={round.prompt} />
          <Timer
            room={room}
            time={3}
            text={'Round starting in '} />
        </Container>
      </Container>
    );
  }
}

ParticipantPreRound.propTypes = {
  round: React.PropTypes.object,
  room: React.PropTypes.object,
};
