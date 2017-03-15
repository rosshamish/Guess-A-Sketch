import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

import { currentRound } from '/imports/game-status';

import { 
  changeRoundStatus,
  changeRoomStatus,
} from '/imports/api/methods';

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
    }

    if (nextProps.isHost) {
      const didChangeRoomStatus = changeRoomStatus.call({
        room_id: nextProps.room._id,
        room_status: "JOINABLE"
      });
      if (!didChangeRoomStatus) {
        console.error('Unable to change room status. Server rejected request.');
        return;
      }

      const didChangeRoundStatus = changeRoundStatus.call({
        room_id: nextProps.room._id,
        round_index: currentRound(nextProps.room).index,
        round_status: "COMPLETE"
      });
      if (!didChangeRoundStatus) {
        console.error('Unable to change round status. Server rejected request.');
        return;
      }
    }
  }

  render() {
    const { 
      room,
      time 
    } = this.props;

    return (
      <div className="timer">
        Time Remaining: {this.state.remaining}
      </div>
    );
  }
}

Timer.propTypes = {
  room: React.PropTypes.object,
  time: Number,
  isHost: React.PropTypes.bool,
};
