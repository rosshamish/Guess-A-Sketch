import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class Timer extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { time } = this.props;

    return (
      <div className="timer">
        {time}
      </div>
    );
  }
}

Timer.propTypes = {
  time: React.PropTypes.number,
};
