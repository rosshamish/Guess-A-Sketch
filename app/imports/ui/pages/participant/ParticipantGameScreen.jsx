import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

// TODO import the right names once api/rooms.js is available
import { Room, Name } from '/imports/api/rooms.js';

export default class ParticipantGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      sketch: null,
    };
  }

  render() {
    const {
      room,
    } = this.props;

    if (!Name || !Room) {
      return (
        <div>
          <p>You must join a room before playing. Go to /join</p>
        </div>
      );
    }

    return (
      <div class="game-screen">
        <p>The canvas will go here! And the prompt, and timer!</p>
        <p>You've received the name { Name }</p>
        <p>You're in room { Room.id }</p>
      </div>
    );
  }
}

ParticipantGameScreen.propTypes = {
  room: React.PropTypes.object,
};
