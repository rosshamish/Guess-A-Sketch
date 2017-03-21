import React from 'react';
import { Session } from 'meteor/session';
import { browserHistory } from 'react-router';
import BaseComponent from '../../components/BaseComponent.jsx';

import { PLAYER } from '/imports/api/session';
import { randomName } from '/imports/random-name';

import {
  Form,
  Container,
  Button,
  Header,
  Icon,
} from 'semantic-ui-react';

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
      this.setState({ color: 'red' });
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
      console.error('Nickname is required!');
      return;
    }
    if (!this.state.color) {
      console.error('Color is required!');
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

    // TODO dice icon to randomize name
    return (
      <Container>
        <Header as='h2'>
          <Header.Content>
            Pick a name
          </Header.Content>
        </Header>
        <Form onSubmit={this.onSubmit}>
          <Form.Input
            fluid
            inline
            label='Name'
            type='text'
            value={this.state.nickname}
            onChange={this.onNicknameChange} />
          <Form.Select
            fluid
            inline
            label='Color'
            type='text'
            value={this.state.color}
            onChange={this.onColorChange}
            options={[
              { key: 'red', text: 'Red', value: 'red' },
              { key: 'blue', text: 'Blue', value: 'blue' }
            ]} />
          <Button
            fluid
            type="submit">
            Go
          </Button>
        </Form>
      </Container>
    );
  }
}

LoginPage.propTypes = {
};
