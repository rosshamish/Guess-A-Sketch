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
      room,
    } = this.props;

    return (
      <p>Will display Host Game Screen. Prompt! Timer!</p>
    );
  }
}

HostGameScreen.propTypes = {
  room: React.PropTypes.object,
};
