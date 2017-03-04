import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

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

    return (
      <p>The canvas will go here! And the prompt, and timer!</p>
    );
  }
}

ParticipantGameScreen.propTypes = {
  room: React.PropTypes.object,
};
