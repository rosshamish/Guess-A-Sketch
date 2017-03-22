import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Timer from './Timer.jsx';
import {
  Header,
  Container,
  Label,
} from 'semantic-ui-react';

export default class HostPlayRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { 
      round,
      room,
      onRoundTimerOver,
    } = this.props;

    return (
      <Container>
        <Label.Group size="huge">
          <Header as='h1'>Round In Progress</Header>
          <Container>
            <Prompt prompt={round.prompt} />
            <Timer
              room={room}
              time={round.time}
              onTimeout={onRoundTimerOver.bind(null, room)}
              text={'Time Remaining: '} />
          </Container>
        </Label.Group>
      </Container>
    );
  }
}

HostPlayRound.propTypes = {
  round: React.PropTypes.object,
  room: React.PropTypes.object,
  onRoundTimerOver: React.PropTypes.func,
};
