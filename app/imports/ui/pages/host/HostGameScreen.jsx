import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import { Session } from 'meteor/session';

import Timer from '../../components/Timer.jsx';
import Prompt from '../../components/Prompt.jsx';

import { HOST_ROOM } from '/imports/api/session';

export default class HostGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {} = this.props;

    let Room = Session.get(HOST_ROOM);

    let prompt = Room.rounds[0].prompt;
    let time = Room.rounds[0].time;

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
        </div>
      );
    }

    return HostGame;

  }
}

HostGameScreen.propTypes = {
};
