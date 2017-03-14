import React from 'react';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import { PLAYER } from '/imports/api/session';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';

export default class ParticipantJoiningBetweenRounds extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      round,
    } = this.props;

    return (
      <p>
        Successfully joined the room! You'll play in the next round.
      </p>
    );
  }
}

ParticipantJoiningBetweenRounds.propTypes = {
};
