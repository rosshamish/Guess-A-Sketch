import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from './BaseComponent.jsx';

import Prompt from './Prompt.jsx';
import Canvas from './Canvas.jsx';
import Timer from './Timer.jsx';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';


export default class ParticipantPlayRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { round } = this.props;

    return (
      <div id='game-container'>
        <div>
          <Prompt prompt={round.prompt} />
          <Timer time={round.time} isHost={false} />
        </div>
        <Canvas prompt={round.prompt} player={Session.get(PLAYER)} />
      </div>
    );
  }
}

ParticipantPlayRound.propTypes = {
  round: React.PropTypes.object,
};
