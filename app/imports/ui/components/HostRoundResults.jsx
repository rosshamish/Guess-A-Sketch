import React from 'react';
import { _ } from 'meteor/underscore';
import { Session } from 'meteor/session';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';

import { HOST_ROOM } from '/imports/api/session';

export default class HostRoundResults extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onNextRound(event){
    event.preventDefault();

    // check if end of game
    if (Session.get(HOST_ROOM).nextRoundIndex < Session.get(HOST_ROOM).rounds.length){
        // TO DO: set next round
    } else {
        // TO DO: set game over
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

HostRoundResults.propTypes = {
  round: React.PropTypes.object,
};
