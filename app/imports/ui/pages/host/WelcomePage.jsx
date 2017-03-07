import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

import { Rooms } from '../../../api/collections/rooms';

// TODO import the right names once api/rooms.js is available
import { Room } from '/imports/api/rooms.js';

export default class WelcomePage extends BaseComponent {
    constructor(props) {
        super(props);
        this.props = props;
    }

    onStartGame(event){
        event.preventDefault(); // Don't reload the page
        console.log('Starting Game.');
        // add proper routing functionality here
    }

    render() {
        const {
          room,
        } = this.props;

        if (!Room) {
          return (
            <div>
              <p>Error setting up your room. Please try again.</p>
            </div>
          );
        }

        //let code = this.props.room.substr(this.props.room.length - 4);
        //let name = Rooms.find({_id: {$eq: this.props.room}});

        return (
            <form onSubmit={this.onStartGame}>
              <h3>Welcome to {Room.id}!</h3>
              <p>Room Code: {Room.id}</p>
              <button type="submit">Start Game</button>
            </form>
        );
    }
}

WelcomePage.propTypes = {
    room: React.PropTypes.object,
};