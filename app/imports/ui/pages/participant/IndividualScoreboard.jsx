import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

import Canvas from '../../components/Canvas.jsx';
import Timer from '../../components/Timer.jsx';
import Prompt from '../../components/Prompt.jsx';

export default class IndividualScoreboard extends BaseComponent {
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
      <p>This will be the individual scoreboard post-game!</p>
    );
  }
}

IndividualScoreboard.propTypes = {
  room: React.PropTypes.object,
};
