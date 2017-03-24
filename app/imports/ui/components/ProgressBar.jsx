import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import {
  Progress
} from 'semantic-ui-react';


export default class ProgressBar extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      remaining: props.time,
    };
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
    }
  }

  render() {
    const {
      time,
    } = this.props;

    percent = (time - this.state.remaining)/time*100;
    console.log(percent);
    return (
      <Progress color='blue' percent={percent} />
    );
  }
}

ProgressBar.propTypes = {
  time: React.PropTypes.number,
};
