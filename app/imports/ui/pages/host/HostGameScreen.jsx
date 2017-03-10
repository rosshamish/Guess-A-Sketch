import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import { browserHistory } from 'react-router';
import { Session } from 'meteor/session';

import Timer from '../../components/Timer.jsx';
import Prompt from '../../components/Prompt.jsx';

import { HOST_ROOM, TIMER } from '/imports/api/session';

export default class HostGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onRoundEnd(event){
    event.preventDefault();

    room = Session.get(HOST_ROOM);

    // change round status
    room.rounds[room.nextRoundIndex].status = "COMPLETE";
    room.nextRoundIndex = room.nextRoundIndex + 1;
    Session.set(HOST_ROOM, room);

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
