import React from 'react';
import { Meteor } from 'meteor/meteor';

import {Rooms} from '../../../api/collections/rooms';
import BaseComponent from '../../components/BaseComponent.jsx';

export default class CreateARoom extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            roomName: '',
            roundCount: 10 // set a default
        };

        this.onRoomNameChange = this.onRoomNameChange.bind(this);
        this.onRoundCountChange = this.onRoundCountChange.bind(this);
        this.onCreateRoom = this.onCreateRoom.bind(this);
    }

    onRoomNameChange(event){
        this.setState({roomName: event.target.value});
    }

    onRoundCountChange(event){
        this.setState({roundCount: event.target.value});
    }

    //TODO: Add check for unique room name at this stage?
    //TODO: Checking for existing rooms names are setting...
    //TODO: ...this component in a persistent state
    onCreateRoom(event){
        event.preventDefault();

        if(!this.state.roomName){
            console.log('Fill in Room name');
            return;
        }else if(!this.state.roundCount > 0){
            console.log('RoundCount must be > 0 ');
            return;
        }else{
        }

        let id = Rooms.insert({ name: this.state.roomName });
        console.log(`Creating room ${this.state.roomName} ${id}`);

        // possibly not fully functioning routing
        this.props.router.push({
          pathname: '/host/lobby',
          props: { room: id}
        });
    }

    render(){
        const {} = this.props;
        return (
            <form onSubmit={this.onCreateRoom}>
                Room Name:
                <input
                    type="text"
                    name="roomName"
                    ref={(input) => (this.roomName = input)}
                    value={this.state.roomName}
                    onChange={this.onRoomNameChange}/>
                <br/>
                Number of Rounds:
                <input
                    type="number"
                    name="roomName"
                    value={this.state.roundCount}
                    onChange={this.onRoundCountChange}/>
                <br/>
                <button>Create A Room</button>
            </form>
        );
    }
}

CreateARoom.propTypes = {
    room: React.PropTypes.object,
}
