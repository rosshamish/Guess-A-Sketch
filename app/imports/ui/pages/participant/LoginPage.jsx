import React from 'react';
import { Session } from 'meteor/session';
import { browserHistory } from 'react-router';
import BaseComponent from '../../components/BaseComponent.jsx';

import { PLAYER } from '/imports/api/session';
import { randomName } from '/imports/random-name';


export default class LoginPage extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      nickname: null,
      color: null,
    };


    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    if (this.state.nickname === null) {
      this.setState({ nickname: randomName() });
    }
    if (this.state.color === null) {
      this.setState({ color: 'red'})
    }
  }

  onNicknameChange(event) {
    this.setState({ nickname: event.target.value });
  }

  onColorChange(event) {
    this.setState({ color: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault(); // Don't reload the page

    if (!this.state.nickname) {
      console.error('Join room request denied by client. Nickname is required!');
      return;
    }
    if (!this.state.color) {
      console.error('Join room request denied by client. Color is required!');
      return;
    }

    Session.set(PLAYER, {
      name: this.state.nickname,
      color: this.state.color,
    });

    browserHistory.push('/join');
  }

  render() {
    const {
    } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        Nickname:
        <input
          type="text"
          name="nickname"
          value={this.state.nickname}
          onChange={this.onNicknameChange}
        />
        <br />
        Color:
        <select value={this.state.color} onChange={this.onColorChange}>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
        </select>
        <br />
        <button type="submit">Play</button>
      </form>
    );
  }
}

LoginPage.propTypes = {
  room: React.PropTypes.object,
};
