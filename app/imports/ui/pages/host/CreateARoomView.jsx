import React from 'react';

import BaseComponent from '../../components/BaseComponent.jsx';
import {
  Form,
  Container,
  Button,
  Header,
  Segment,
} from 'semantic-ui-react';


export default class CreateARoom extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      roomName: 'test' + Math.floor((Math.random() * 100) + 1), // make room name random
      roundCount: 2, // set to 10
      roundTime: 10, // set to 20
    };

    this.onRoomNameChange = this.onRoomNameChange.bind(this);
    this.onRoundCountChange = this.onRoundCountChange.bind(this);
    this.onRoundTimeChange = this.onRoundTimeChange.bind(this);
  }

  onRoomNameChange(event) {
    this.setState({roomName: event.target.value});
  }

  onRoundCountChange(event) {
    this.setState({roundCount: event.target.value});
  }

  onRoundTimeChange(event) {
    this.setState({roundTime: event.target.value});
  }

  render() {
    const {
      loading,
      onCreateRoom,
    } = this.props;

    if (loading) {
      return (
        <p>Loading...</p>
      )
    }

    // TODO check browser compat
    const style = {
      display: 'flex',
      justifyContent: 'center',
    };

    return (
      <Segment.Group style={style}>
        <Segment>
          <Header as="h1" style={style}>
            Create A Room
          </Header>
        </Segment>
        <Segment>
          <Form 
            onSubmit={(event) => {
              event.preventDefault();
              onCreateRoom(this.state.roomName,
                           this.state.roundCount,
                           this.state.roundTime);
            }}
          >
          <Form.Input
            style={style}
            fluid
            inline
            label='Room Name'
            type="text"
            name="roomName"
            ref={(input) => (this.roomName = input)}
            value={this.state.roomName}
            onChange={this.onRoomNameChange}/>
          <Form.Input
            style={style}
            fluid
            inline
            label='Number of Rounds'
            type="number"
            name="roomName"
            value={this.state.roundCount}
            placeholder="Number of Rounds"
            onChange={this.onRoundCountChange}/>
          <Form.Input
            style={style}
            fluid
            inline
            label='Time'
            type="number"
            name="roomName"
            value={this.state.roundTime}
            placeholder="Time"
            onChange={this.onRoundTimeChange} />
          <Button
            fluid
            primary
            type="submit" >
            Create
          </Button>
          </Form>
        </Segment>
      </Segment.Group>
    );
  }
}

CreateARoom.propTypes = {
  loading: React.PropTypes.bool,
  onCreateRoom: React.PropTypes.func,
}
