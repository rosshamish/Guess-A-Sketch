import React from 'react';
import BaseComponent from './BaseComponent.jsx';


export default class ParticipantEndGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      room,
    } = this.props;

    return (
      <p>This will be the post-game individual scoreboard</p>
    );
  }
}

ParticipantEndGameScreen.propTypes = {
  room: React.PropTypes.object,
};
