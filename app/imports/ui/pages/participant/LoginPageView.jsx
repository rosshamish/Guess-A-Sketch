import React from 'react';

import { randomName } from '/imports/random-name';

import BaseComponent from '../../components/BaseComponent.jsx';
import {
  Form,
  Container,
  Button,
  Header,
  Icon,
} from 'semantic-ui-react';


export default class LoginPageView extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      nickname: null,
      color: null,
    };


    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
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

  render() {
    const {
      onSubmit,
    } = this.props;

    // TODO dice icon to randomize name
    return (
      <Container>
        <Header as='h1'>
          <Header.Content>
            Pick A Name
          </Header.Content>
        </Header>
        <Form onSubmit={onSubmit.bind(null, this.state.nickname, this.state.color)}>
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
            primary
            type="submit">
            Go
          </Button>
        </Form>
      </Container>
    );
  }
}

LoginPageView.propTypes = {
  onSubmit: React.PropTypes.func,
};
