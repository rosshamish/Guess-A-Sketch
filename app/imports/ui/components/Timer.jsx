import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class Prompt extends BaseComponent {
  constructor(props) {
    super(props);
  }

  // http://meteorlife.com/build-a-countdown-timer-with-meteor/

  render() {
    const { time } = this.props;

    return (
      <div className="timer">
        Timer: {time}
      </div>
    );
  }
}

Prompt.propTypes = {
  time: React.PropTypes.number,
};