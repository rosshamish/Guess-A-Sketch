import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from '../../components/BaseComponent.jsx';
import { browserHistory } from 'react-router';
import { Session } from 'meteor/session';

import { HOST_ROOM } from '/imports/api/session';
import Canvas from '../../components/Collage.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

import { Sketches } from '/imports/api/collections/sketches';


export default class CollageScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onNextRound(event){
    event.preventDefault();

    // check if end of game
    if (Session.get(HOST_ROOM).nextRoundIndex < Session.get(HOST_ROOM).rounds.length){
        browserHistory.push('/host/play');
    } else {
        browserHistory.push('/host/game-over');
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

CollageScreen.propTypes = {
  round: React.PropTypes.object,
};
