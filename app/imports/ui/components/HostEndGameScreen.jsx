import React from 'react';
import BaseComponent from './BaseComponent.jsx';
import { _ } from 'meteor/underscore';

import { getGameScore } from '/imports/scoring';

export default class HostEndGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      room,
    } = this.props;
    
    var scores = [];
    players = room.players;
    for (var i in players) {
      scores[scores.length] = {name:players[i].name, score:getGameScore(room, players[i])}
    }
    scores = _.sortBy(scores, 'score').reverse();

    var renderScores = scores.map(function(row,index) {
      return ( // key suppresses a key error in console
        <tr key={index}>
          <th>{index+1}</th>
          <th>{row.name}</th>
          <th>{row.score}</th>
        </tr>
      );
    });

    return(
      <div className="host-end-game">
        <h1>Game Results</h1>
        <table>
        <tbody>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
          {renderScores}
        </tbody>
        </table>
      </div>
    );
  }
}

HostEndGameScreen.propTypes = {
  room: React.PropTypes.object,
};
