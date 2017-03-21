import React from 'react';
import { _ } from 'meteor/underscore';
import { Session } from 'meteor/session';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Timer from './Timer.jsx';

import { roundTimerOver } from '/imports/api/methods';

import {
  Header,
  Container,
  Label,
} from 'semantic-ui-react';

export default class HostPlayRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  onTimeout(room) {
    const didSucceed = roundTimerOver.call({
      room_id: room._id,
    });
    if (!didSucceed) {
      console.error('Server rejected request.');
      return;
    }
  }

  render() {
    const { 
      round,
      room
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
              onTimeout={this.onTimeout.bind(null, room)}
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
};
