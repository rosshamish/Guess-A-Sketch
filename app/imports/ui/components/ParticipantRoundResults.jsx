import React from 'react';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import { Sketches } from '/imports/api/collections/sketches';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import SketchImage from './SketchImage.jsx';
import ParticipantJoiningBetweenRounds from './ParticipantJoiningBetweenRounds.jsx';

import {
  getRoundScore,
} from '/imports/scoring';


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
    // filtering to the current player's.
    const currentPlayer = Session.get(PLAYER);
    const sketches = _.map(round.sketches, (sketchID) => {
      return Sketches.findOne({ _id: sketchID });
    });
    const currentPlayerSketches = _.filter(sketches, (sketch) => {
      return sketch.player.name === currentPlayer.name;
    });

    if (currentPlayerSketches.length === 0) {
      return <ParticipantJoiningBetweenRounds />
    } else if (currentPlayerSketches.length > 1) {
      console.error('Player had too many sketches in latest round. Had ' + currentPlayerSketches.length + '.');
      return <ErrorMessage />
    }

    const currentPlayerSketch = currentPlayerSketches[0];

    return (
      <div>
        <h1>Round Results</h1>
        <h3>You drew:</h3>
        <SketchImage sketch={currentPlayerSketch} />
        <hr />
        <h3>SketchNet:</h3>
        <p>"Looks like a... TODO"</p>
        <p>Score: {getRoundScore(round, Session.get(PLAYER))}</p>
      </div>
    );
  }
}

ParticipantRoundResults.propTypes = {
  round: React.PropTypes.object,
};
