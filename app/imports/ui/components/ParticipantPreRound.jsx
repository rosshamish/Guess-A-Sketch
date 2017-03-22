import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Timer from './Timer.jsx';
import {
  Header,
  Container,
  Label,
} from 'semantic-ui-react';

export default class ParticipantPreRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      room,
      round,
    } = this.props;

    return (
      <Container>
        <Label.Group size="huge">
          <Header as='h1'>Round #{round.index + 1}</Header>
          <Container>
            <Prompt prompt={round.prompt} />
            <Timer
              room={room}
              time={3}
              text={'Round starting in '} />
          </Container>
        </Label.Group>
      </Container>
    );
  }
}

ParticipantPreRound.propTypes = {
  room: React.PropTypes.object,
  round: React.PropTypes.object,
};
