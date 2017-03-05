import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

import Timer from '../../components/Timer.jsx';
import Prompt from '../../components/Prompt.jsx';

export default class HostGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      round,
    } = this.props;

    let HostGame;
    if (round == null) {
      HostGame = (
        <h3>Error displaying host game screen. Please try again.</h3>
      );
    } else {
      HostGame = (
        <div>
        <p>Will display Host Game Screen. Prompt! Timer!</p>
        <Prompt round = {round} />
        </div>
      );
    }

    return HostGame;

  }
}

HostGameScreen.propTypes = {
  round: React.PropTypes.object,
};
