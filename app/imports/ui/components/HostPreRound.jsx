import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Timer from './Timer.jsx';
import {
  Header,
  Container,
  Label,
  Segment,
} from 'semantic-ui-react';

export default class HostPreRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      round,
      room,
      onPlayRound,
    } = this.props;

    return (
      <Segment.Group>
        <Segment>
          <Header as='h1'>Round {round.index + 1}</Header>
        </Segment>
        <Segment.Group horizontal>
          <Segment>
            Prompt:
            <Prompt prompt={round.prompt} />
          </Segment>
          <Segment>
            Countdown:
            <Timer
              room={room}
              time={3}
              onTimeout={onPlayRound.bind(null, room)}
              text={'Starting in '} />
          </Segment>
        </Segment.Group>
      </Segment.Group>
    );
  }
}

HostPreRound.propTypes = {
  room: React.PropTypes.object,
  round: React.PropTypes.object,
  onPlayRound: React.PropTypes.func,
};
