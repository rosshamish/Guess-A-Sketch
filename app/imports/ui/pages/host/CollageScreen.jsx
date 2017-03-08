import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import { browserHistory } from 'react-router';
import { Session } from 'meteor/session';

import Canvas from '../../components/Collage.jsx';

import { HOST_ROOM } from '/imports/api/session';

export default class CollageScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onNextRound(event){
    event.preventDefault();

    if (Session.get(HOST_ROOM).rounds.length > 0){
      browserHistory.push('/host/play');
    } else {
      browserHistory.push('/host/game-over');
    }

  }

  render() {
    const {
      round,
    } = this.props;

    return (
      <div>
      <p>Will display a collage of all drawings from the previous round!</p>
      <form onSubmit={this.onNextRound}>
        <button>Done</button>
      </form>
      </div>
    );
  }
}

CollageScreen.propTypes = {
  round: React.PropTypes.object,
};
