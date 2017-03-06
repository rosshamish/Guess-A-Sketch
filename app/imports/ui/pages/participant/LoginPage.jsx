import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

export default class LoginPage extends BaseComponent {
  __URL_ROOMS = '/rooms';

  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
    };

    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onNicknameChange(event) {
    this.setState({ nickname: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault(); // Don't reload the page
    if (!this.state.nickname) {
      console.log('Nickname required!');
    } else {
      console.log(__URL_ROOMS);
      this.props.history.push(__URL_ROOMS);
    }
  }

  render() {
    const {
    } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        Nickname/Color:<br />
        <input
          type="text"
          name="nickname"
          value={this.state.nickname}
          onChange={this.onNicknameChange}
        />
        <br />
        <button type="submit">Play</button>
      </form>
    );
  }
}

LoginPage.propTypes = {
  room: React.PropTypes.object,
};
