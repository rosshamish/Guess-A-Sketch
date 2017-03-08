import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import { browserHistory } from 'react-router';

import PlayerItem from '../../components/PlayerItem.jsx';

export default class WelcomePage extends BaseComponent {
    constructor(props) {
        super(props);
        this.props = props;
    }

    onStartGame(event){
        event.preventDefault(); // Don't reload the page
        console.log('Starting Game.');
        browserHistory.push('/host/play');
    }

    render() {
        const {
          loading,
          players,
          room
        } = this.props;

        if (!room) {
          return (
            <div>
              <p>Error setting up your room. Please try again.</p>
            </div>
          );
        } else if (loading) {
          // Early return
          return (
            <h3>Loading...</h3>
          );
        }

        let player_list = 'N/A';
        if (players.length > 0) {
          player_list = players.map(function(player,index) {
            return (
              <PlayerItem 
              key = {player._id}
              text = {player.name} />
            );
          });
        }

        return (
            <form onSubmit={this.onStartGame}>
              <h3>Welcome!</h3>
              <p>Room Name: {room.name}</p>
              <p>Room Code: {room._id.substring(0, 4)}</p>
              <p>Players in Room: </p>
              <div> {player_list} </div>
              <button type="submit">Start Game</button>
            </form>
        );
    }
}

WelcomePage.propTypes = {
  room: React.PropTypes.object,
  loading: React.PropTypes.bool,
  players: React.PropTypes.array,
};
