import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import { browserHistory } from 'react-router';

import { HOST_ROOM } from '/imports/api/session';

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
        const {} = this.props;

        let Room = Session.get(HOST_ROOM);

        if (!Room) {
          return (
            <div>
              <p>Error setting up your room. Please try again.</p>
            </div>
          );
        }

        return (
            <form onSubmit={this.onStartGame}>
              <h3>Welcome!</h3>
              <p>Room Name: {Room.name}</p>
              <p>Room Code: {Room._id.substring(0, 4)}</p>
              <button type="submit">Start Game</button>
            </form>
        );
    }
}

WelcomePage.propTypes = {
};