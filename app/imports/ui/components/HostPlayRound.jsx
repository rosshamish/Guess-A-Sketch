import React from 'react';
import { _ } from 'meteor/underscore';
import { Session } from 'meteor/session';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Timer from './Timer.jsx';

import {
  roundTimerOver,
} from '/imports/api/methods';


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
      <div className="host-play">
        <h1>Round in progress</h1>
        <div className="host-game-screen">
          <Prompt prompt={round.prompt} />
          <Timer
            room={room}
            time={round.time}
            onTimeout={this.onTimeout.bind(null, room)}
            text={'Time remaining: '} />
        </div>
      </div>
    );
  }
}

HostPlayRound.propTypes = {
  round: React.PropTypes.object,
  room: React.PropTypes.object,
};
