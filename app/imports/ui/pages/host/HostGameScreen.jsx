import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

import Timer from '../../components/Timer.jsx';
import Prompt from '../../components/Prompt.jsx';

// TODO import the right names once api/rooms.js is available
import { Room } from '/imports/api/rooms.js';

export default class HostGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      room,
    } = this.props;

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
  room: React.PropTypes.object,
};
