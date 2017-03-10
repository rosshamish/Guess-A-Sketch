import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import { browserHistory } from 'react-router';
import { Session } from 'meteor/session';

import Timer from '../../components/Timer.jsx';
import Prompt from '../../components/Prompt.jsx';

import { HOST_ROOM, TIMER } from '/imports/api/session';
import { incrementNextRoundIndex, changeRoundStatus } from '/imports/api/methods';

export default class HostGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onRoundEnd(event){
    event.preventDefault();

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

    // Navigate to the collage screen
    browserHistory.push('/host/collage');
  }

  render() {
    const {} = this.props;

    let Room = Session.get(HOST_ROOM);

    let prompt = Room.rounds[0].prompt;
    let time = Room.rounds[0].time;
    Session.set(TIMER, time);

    let HostGame;
    if (Room == null) {
      HostGame = (
        <h3>Error displaying host game screen. Please try again.</h3>
      );
    } else {
      HostGame = (
        <div>
        <Prompt prompt = {prompt} />
        <Timer time = {time} />
        <form onSubmit={this.onRoundEnd}>
          <button>Timer Expired</button>
        </form>
        </div>
      );
    }

    return HostGame;

  }
}

HostGameScreen.propTypes = {};
