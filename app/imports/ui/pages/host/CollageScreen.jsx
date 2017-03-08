import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import { browserHistory } from 'react-router';

import Canvas from '../../components/Collage.jsx';

export default class CollageScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onNextRound(event){
    event.preventDefault();

    browserHistory.push('/host/play');
  }

  onGameEnd(event){
    event.preventDefault();

    browserHistory.push('/host/game-over');
  }

  render() {
    const {
      round,
    } = this.props;

    // These buttons are temporary
    return (
      <div>
      <p>Will display a collage of all drawings from the previous round!</p>
      <form onSubmit={this.onNextRound}>
        <button>Next Round</button>
      </form>
      <form onSubmit={this.onGameEnd}>
        <button>Game End</button>
      </form>
      </div>
    );
  }
}

CollageScreen.propTypes = {
  round: React.PropTypes.object,
};
