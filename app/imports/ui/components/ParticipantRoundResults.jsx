import React from 'react';
import { _ } from 'meteor/underscore';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';

export default class ParticipantRoundResults extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      round,
    } = this.props;

    const currentPlayerSketches = _.filter(round.sketches, (sketch) => {
      return sketch.player.name === sketch.player.name;
    });
    if (currentPlayerSketches.length != 1) {
      console.error('Expected player to have exactly one sketch in the latest round.');
      return <ErrorMessage />
    }

    const currentPlayerSketch = currentPlayerSketches[0];

    return (
      <div>
        <img src={Session.get(SKETCH)} />
        <hr />
        <p>Scores: {currentPlayerSketch.scores}</p>
      </div>
    );
  }
}

ParticipantRoundResults.propTypes = {
  round: React.PropTypes.object,
};
