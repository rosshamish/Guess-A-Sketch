import React from 'react';
import BaseComponent from './BaseComponent.jsx';

import { pickRandom } from '/imports/random-name';

const sorrys = [
  'Whoops.',
  'Uh oh.',
  'Shoot.',
  'Bad news',
  'Dang it!',
];
export const errorCodes = {
  host: {
    noRoom: 0,
    noRound: 1,
    illegalRoomState: 2,
    illegalRoundState: 3,
  },
  participant: {
    noRoom: 100,
    noRound: 101,
    noPlayer: 102,
    illegalRoundState: 103,
  },
  roomList: {
    undefinedRooms: 200,
    noPlayer: 201,
  },
};

export default class ErrorMessage extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { } = this.props;

    return (
      <div className="error-message">
        Whoops! Something went wrong. Check the console.
      </div>
    );
  }
}

ErrorMessage.propTypes = {
  code: React.PropTypes.number.required,
};
