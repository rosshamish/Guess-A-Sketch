import React from 'react';
import { browserHistory } from 'react-router';
import BaseComponent from './BaseComponent.jsx';
import {
  Segment,
  Header,
  Message,
  Button,
} from 'semantic-ui-react';

import { pickRandom } from '/imports/random-name';
const sorrys = [
  'Whoops.',
  'Uh oh.',
  'Shoot.',
  'Bad news.',
  'Dang it!',
  'Oops!',
];
export const errorCodes = {
  host: {
    noRoom: {
      id: 0,
      uiMessage: 'You are not hosting a room.',
    },
    noRound: {
      id: 1,
      uiMessage: 'There is no current round.',
    },
    illegalRoomState: {
      id: 2,
      uiMessage: 'The room is in an bad state.',
    },
    illegalRoundState: {
      id: 3,
      uiMessage: 'The round is in an bad state.',
    },
  },
  participant: {
    noRoom: {
      id: 100,
      uiMessage: 'You are not in a room.',
    },
    noRound: {
      id: 101,
      uiMessage: 'Your room is in a bad state. Ask the host to fix it.',
    },
    noPlayer: {
      id: 102,
      uiMessage: 'You are not logged in. Try logging in again.',
    },
    illegalRoomState: {
      id: 103,
      uiMessage: 'Your room is in a bad state.',
    },
    illegalRoundState: {
      id: 104,
      uiMessage: 'Your room is in a bad state.',
    },
  },
  roomList: {
    undefinedRooms: {
      id: 200,
      uiMessage: 'Failed to search for rooms. Is the server down?',
    },
    noPlayer: {
      id: 201,
      uiMessage: 'You are not logged in. Log in before joining a room.',
    },
  },
};

export default class ErrorMessage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      sorry: pickRandom(sorrys),
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  }

  render() {
    const { code } = this.props;

    let action = <p>Try reloading the page.</p>;
    if (code.id < 100) { // Host errors
      action = (
        <Button
          loading={this.state.loading}
          disabled={this.state.loading}
          onClick={() => browserHistory.push('/host/create')}>
          Remake the room
        </Button>
      );
    } else if (code.id < 200) { // Participant errors
      action = (
        <Button
          loading={this.state.loading}
          disabled={this.state.loading}
          onClick={() => browserHistory.push('/login')}>
          Rejoin as new player
        </Button>
      );
    } else if (code.id < 300) { // RoomList errors
      action = (
        <Button
          loading={this.state.loading}
          disabled={this.state.loading}
          onClick={() => browserHistory.push('/login')}>
          Rejoin as new player
        </Button>
      );
    }

    return (
      <Segment loading={this.state.loading}>
        <Header as='h1'>{this.state.sorry}</Header>
        <Message negative>
          <Message.Header>{code.uiMessage}</Message.Header>
        </Message>
        {action}
      </Segment>
    );
  }
}

ErrorMessage.propTypes = {
  code: React.PropTypes.object.isRequired,
};
