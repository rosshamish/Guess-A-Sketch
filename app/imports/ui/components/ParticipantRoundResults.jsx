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
      console.error('Expected player to have exactly one sketch in the latest round.');
      return <ErrorMessage />
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
  round: React.PropTypes.object,
};
