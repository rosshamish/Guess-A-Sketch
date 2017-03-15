import React from 'react';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import { HOST_ROOM } from '/imports/api/session';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import SketchImage from './SketchImage.jsx';

import { Sketches } from '/imports/api/collections/sketches';
import { 
  changeRoundStatus,
  changeRoomStatus,
} from '/imports/api/methods';
import { currentRound } from '/imports/game-status';


export default class HostRoundResults extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onNextRound(event){
    event.preventDefault();

    let room = Session.get(HOST_ROOM);

    // Is the game still ongoing?
    if (currentRound(room).index < room.rounds.length){
      const didChangeRoomStatus = changeRoomStatus.call({
        room_id: room._id,
        room_status: "PLAYING"
      });
      if (!didChangeRoomStatus) {
        console.error('Unable to change room status. Server rejected request.');
        return;
      }

      // change round status
      const didChangeRoundStatus = changeRoundStatus.call({
        room_id: room._id,
        round_index: currentRound(room).index + 1,
        round_status: "PLAYING"
      });
      if (!didChangeRoundStatus) {
        console.error('Unable to change round status. Server rejected request.');
        return;
      }
    } else {
      // The game is over.
      if (room.nextRoundIndex == 0){
        const didChangeRoomStatus = changeRoomStatus.call({
          room_id: room._id,
          room_status: "COMPLETE"
        });
         if (!didChangeRoomStatus) {
          console.error('Unable to change room status. Server rejected request.');
          return;
        }
      }
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
      return <SketchImage key={sketch._id} sketch={sketch} />
    });

    return (
      <div className="collage">
        <h1>Sketches this round</h1>
        <div className="sketches">
          {SketchComponents}
        </div>
        <form onSubmit={this.onNextRound}>
          <button>Next Round</button>
        </form>
      </div>
    );
  }
}

HostRoundResults.propTypes = {
  round: React.PropTypes.object,
};
