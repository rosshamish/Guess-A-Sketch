import React from 'react';

import BaseComponent from '../../components/BaseComponent.jsx';
import {
  Form,
  Container,
  Button,
  Header,
  Segment,
  Icon,
} from 'semantic-ui-react';

import {
  randomMuseumName,
} from '/imports/random-name';

export default class CreateARoom extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      roomName: randomMuseumName(),
      roundCount: 5,
      roundTime: 25,
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
         <Header as="h1" icon textAlign="center">
            <Icon name="group" circular />
            <Header.Content>
              Create A Room
            </Header.Content>
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
          <div id='roomName' style={{display: 'inline-block', width: '98%'}}>
            <Form.Input
              style={style}
              inline
              label='Room Name'
              type="text"
              name="roomName"
              ref={(input) => (this.roomName = input)}
              value={this.state.roomName}
              onChange={this.onRoomNameChange}/>
          </div>
          <div id='roomNameRandomize' style={{display: 'inline-block', width: '2%'}}>
            <Button icon onClick={(event) => {
              event.preventDefault();
              this.setState({roomName: randomMuseumName()});
            }}>
              <Icon name='refresh' />
            </Button>
          </div>
          <Form.Input
            style={style}
            inline
            label='Number of Rounds'
            type="number"
            name="roomName"
            value={this.state.roundCount}
            placeholder="Number of Rounds"
            onChange={this.onRoundCountChange}/>
          <Form.Input
            style={style}
            inline
            label='Time'
            type="number"
            name="roomName"
            value={this.state.roundTime}
            placeholder="Time"
            onChange={this.onRoundTimeChange} />
          <center>
            <Button
              primary
              type="submit" >
              Create
            </Button>
          </center>
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
