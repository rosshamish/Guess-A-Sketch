import React from 'react';
import { _ } from 'meteor/underscore';
import { Session } from 'meteor/session';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Timer from './Timer.jsx';

import { HOST_ROOM, TIMER } from '/imports/api/session';
import { incrementNextRoundIndex, changeRoundStatus } from '/imports/api/methods';

export default class HostPlayRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  onRoundEnd(event){
    event.preventDefault();

    // TO DO: fix to use this.props instead
    let room = Session.get(HOST_ROOM);

    // change round status
    const didChangeRoundStatus = changeRoundStatus.call({
      room_id: room._id,
      round_index: room.nextRoundIndex,
      round_status: "COMPLETE"
    });
    if (!didChangeRoundStatus) {
      console.error('Unable to change round status. Server rejected request.');
      return;
    }

    // increment nextRoundIndex
    const didChangeNextRoundIndex = incrementNextRoundIndex.call({
      room_id: room._id,
      next_index: room.nextRoundIndex + 1,
    });
    if (!didChangeNextRoundIndex) {
      console.error('Unable to change round index. Server rejected request.');
      return;
    }
    
  }

  render() {
    const { round } = this.props;

    Session.set(TIMER, round.time);

    return (
      <div className="host-game-screen">
        <Prompt prompt = {round.prompt} />
        <Timer time = {round.time} />
        <form onSubmit={this.onRoundEnd}>
          <button>Timer Expired</button>
        </form>
      </div>
    );
  }
}

HostPlayRound.propTypes = {
  round: React.PropTypes.object,
};
