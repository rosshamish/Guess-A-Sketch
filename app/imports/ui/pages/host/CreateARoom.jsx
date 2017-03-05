import React from 'react';

import {Rooms} from '../../../api/collections/rooms';
import BaseComponent from '../../components/BaseComponent.jsx';

export default class CreateARoom extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            roomName: '',
            roundCount: 0
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
    onCreateRoom(event){
        event.preventDefault();
        if(!this.state.roomName || !this.state.roundCount > 0){
            console.log('Cannot create room. Fill all parameters correctly');
            return;
        }else{
            console.log('Creating room ' + this.state.roomName);
        }

        const name = this.state.roomName;
        const count = this.state.roundCount;

        Rooms.insert({roomID: '5555', name: name });
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
