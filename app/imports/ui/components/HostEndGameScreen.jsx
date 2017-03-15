import React from 'react';
import BaseComponent from './BaseComponent.jsx';
import RowComponent from './RowComponent.jsx';

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
    
    // compute a score for each player in the room based on their matching sketches
    var scores = [];
    players = room.players;
    sketches = room.rounds.sketches;
    for (var i in players) {
      let score = 0;
      let rank = parseInt(i) + 1;
      for (var j in sketches){ // optimize this
        if (sketches[j].player.name == players[i].name){
          score += 1; // TO DO: make this a real judgement
        }
      }
      scores[scores.length] = {rank:rank, name:players[i].name, score:score}
    }

    var renderScores = scores.map(function(row,index) {
      return ( // key suppresses a key error in console
        <RowComponent key={index} row={row} />
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
