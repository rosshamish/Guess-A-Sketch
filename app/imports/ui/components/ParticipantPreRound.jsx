import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from './BaseComponent.jsx';

import Prompt from './Prompt.jsx';
import Canvas from './Canvas.jsx';
import Timer from './Timer.jsx';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';


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
      <div className="participant-pre-container">
        <Header as='h1'>Round {round.index + 1}</h1>
        <div className="participant-pre">
          <Prompt prompt={round.prompt} />
          <Timer
            room={room}
            time={3}
            text={'Round starting in '} />
        </div>
      </div>
    );
  }
}

ParticipantPreRound.propTypes = {
  round: React.PropTypes.object,
  room: React.PropTypes.object,
};
