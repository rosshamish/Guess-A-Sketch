import React from 'react';
import BaseComponent from './BaseComponent.jsx';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import {
  getRoundScore,
  getGameScore,
} from '/imports/scoring';

export default class ParticipantEndGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      room,
    } = this.props;

    // TODO compute a score for each player in the room based on their matching sketches
    var renderScores = room.rounds.map(function(round,index) {
      return ( // key suppresses a key error in console
        <tr key={index}>
          <th>{index+1}</th>
          <th>{getRoundScore(round, Session.get(PLAYER))}</th>
        </tr>
      );
    });
    renderScores.push(
      <tr key={room.rounds.length}>
        <th>Total</th>
        <th>{getGameScore(room, Session.get(PLAYER))}</th>
      </tr>
    );

    return(
      <div className="participant-end-game">
        <h1>Your Scores</h1>
        <table>
        <tbody>
          <tr>
            <th>Round</th>
            <th>Score</th>
          </tr>
          {renderScores}
        </tbody>
        </table>
      </div>
    );
  }
}

ParticipantEndGameScreen.propTypes = {
  room: React.PropTypes.object,
};
