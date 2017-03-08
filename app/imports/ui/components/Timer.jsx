import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

import { TIMER } from '/imports/api/session';

export default class Timer extends BaseComponent {
  constructor(props) {
    super(props);
  }

  // http://meteorlife.com/build-a-countdown-timer-with-meteor/
  // http://stackoverflow.com/questions/15229141/simple-timer-in-meteor-js
  render() {
    const {} = this.props;

    return (
      <div className="timer">
        Timer: {Session.get(TIMER)}
      </div>
    );
  }
}

Timer.propTypes = {
};
