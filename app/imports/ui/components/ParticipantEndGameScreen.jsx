import React from 'react';
import BaseComponent from './BaseComponent.jsx';


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
          <th>{Math.floor(Math.random()*100)}</th>
        </tr>
      );
    });

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
