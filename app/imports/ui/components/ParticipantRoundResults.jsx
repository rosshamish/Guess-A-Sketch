import React from 'react';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import { PLAYER } from '/imports/api/session';
import { Sketches } from '/imports/api/collections/sketches';

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

    // TODO more efficient method than fetching ALL sketches and then
    // filtering to the current plalyer's.
    const currentPlayer = Session.get(PLAYER);
    const sketches = _.map(round.sketches, (sketchID) => {
      return Sketches.findOne({ _id: sketchID });
    });
    const currentPlayerSketches = _.filter(sketches, (sketch) => {
      return sketch.player.name === currentPlayer.name;
    });
    if (currentPlayerSketches.length != 1) {
      console.error('Expected player to have exactly one sketch in the latest round. Had ' + currentPlayerSketches.length + '.');
      console.error(currentPlayerSketches);
      console.error(sketches);
      console.error(currentPlayer);
      // TODO better loading screen here. Waiting for sketch to come back from server?
      // Or, is this really an error case.
      return <h2>Loading...</h2>
      // return <ErrorMessage />
    }

    const currentPlayerSketch = currentPlayerSketches[0];

    return (
      <div>
        <img src={currentPlayerSketch.sketch} />
        <hr />
        <p>Scores: {currentPlayerSketch.scores}</p>
      </div>
    );
  }
}

ParticipantRoundResults.propTypes = {
  loading: React.PropTypes.bool,
  round: React.PropTypes.object,
};
