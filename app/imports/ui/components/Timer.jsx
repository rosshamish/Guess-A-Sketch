import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import {
  Label,
  Header,
} from 'semantic-ui-react';


export default class Timer extends BaseComponent {
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
      if (this.props.onTimeout) {
        this.props.onTimeout();
      }
    }
  }

  render() {
    const { 
      text,
    } = this.props;

    return (
      <Header
        size="large"
        floated="right"
        >
        {text}{this.state.remaining}
      </Header>
    );
  }
}

Timer.propTypes = {
  room: React.PropTypes.object,
  time: React.PropTypes.number,
  onTimeout: React.PropTypes.func,
  text: React.PropTypes.string,
};
