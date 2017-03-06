import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

// will be able to remove import after routing is functional
import {Rooms} from '../../../api/collections/rooms';

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
        let WelcomePage;
        if (this.props.room == null) {
            WelcomePage = (
                <h3>Error setting up your room. Please try again.</h3>
            );
            console.log(this.props.room); //TODO:  this currently returns as undefined
        } else {

            let code = this.props.room.substr(this.props.room.length - 4);
            let name = Rooms.find({_id: {$eq: this.props.room}});

            WelcomePage = (
                <form onSubmit={this.onStartGame}>
                  <h3>Welcome to {name}!</h3>
                  <p>Room Code: {code}</p>
                  <button type="submit">Start Game</button>
                </form>
            );
        }

        return WelcomePage;

    }
}

WelcomePage.propTypes = {
    room: React.PropTypes.object,
};