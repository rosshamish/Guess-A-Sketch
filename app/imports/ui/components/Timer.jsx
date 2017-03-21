import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';

import BaseComponent from './BaseComponent.jsx';
import {
  Label,
} from 'semantic-ui-react';


export default class Timer extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      remaining: props.time,
    }
  }

  componentDidMount() {
    this.interval_id = setInterval(() => {
      this.setState({
        remaining: this.state.remaining - 1,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval_id);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.remaining > 0) {
      return;
    } else {
      clearInterval(this.interval_id);
      if (this.props.onTimeout) {
        this.props.onTimeout();
      }
    }
  }

  render() {
    const { 
      room,
      time ,
      text,
    } = this.props;

    return (
      <Label>
        {text}{this.state.remaining}
      </Label>
    );
  }
}

Timer.propTypes = {
  room: React.PropTypes.object,
  time: Number,
  onTimeout: React.PropTypes.func,
  text: React.PropTypes.string,
};
