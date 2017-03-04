import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

export default class LoginPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
    };

    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.onJoinRoom = this.onJoinRoom.bind(this);
  }

  onNicknameChange(event) {
    this.setState({ nickname: event.target.value });
  }

  onJoinRoom(event) {
    event.preventDefault(); // Don't reload the page
    if (!this.state.nickname) {
      console.log('Cannot join room, no nickname set');
    } else {
      console.log('Joining room with nickname ' + this.state.nickname);
    }
  }

  render() {
    const {
    } = this.props;

    return (
      <form onSubmit={this.onJoinRoom}>
        Nickname:<br />
        <input
          type="text"
          name="nickname"
          value={this.state.nickname}
          onChange={this.onNicknameChange}
        />
        <br />
        <button type="submit">Join Room</button>
      </form>
    );
  }
}

LoginPage.propTypes = {
  room: React.PropTypes.object,
};
