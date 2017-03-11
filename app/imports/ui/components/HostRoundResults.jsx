import React from 'react';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import { HOST_ROOM } from '/imports/api/session';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';

import { Sketches } from '/imports/api/collections/sketches';


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

    if (!round) {
      console.error('Round is undefined, cannot render.');
      return <ErrorMessage />
    }

    const sketches = _.map(round.sketches, (sketchID) => {
      return Sketches.findOne({ _id: sketchID });
    });

    const SketchComponents = _.map(sketches, (sketch) => {
      return <SketchImage sketch={sketch} />
    });

    return (
      <div className="collage">
        <div className="sketches">
          {SketchComponents}
        </div>
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
