// SRS 3.2.2.2 : Display Round Prompt and Image

import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Timer from './Timer.jsx';
import ProgressBar from './ProgressBar.jsx';
import {
  Header,
  Segment,
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
      <Segment.Group>
        <Segment>
          <Header as='h1'>Round {round.index + 1} - In Progress</Header>
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
              time={round.time}
              onTimeout={onRoundTimerOver.bind(null, room)}
              text={'Time Remaining: '} />
          </Segment>
        </Segment.Group>
        <Segment>
          <ProgressBar time={round.time} />
        </Segment>
      </Segment.Group>
    );
  }
}

HostPlayRound.propTypes = {
  round: React.PropTypes.object,
  room: React.PropTypes.object,
  onRoundTimerOver: React.PropTypes.func,
};
