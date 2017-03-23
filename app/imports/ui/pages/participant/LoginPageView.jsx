import React from 'react';

import { randomName } from '/imports/random-name';

import BaseComponent from '../../components/BaseComponent.jsx';
import { CirclePicker } from 'react-color';
import {
  Form,
  Container,
  Button,
  Header,
  Icon,
  Segment,
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
      // TODO refactor default color out to somewhere
      this.setState({ color: 'black' });
    }
  }

  onNicknameChange(event) {
    this.setState({ nickname: event.target.value });
  }

  onColorChange(color, event) {
    this.setState({ color: color.hex });
  }

  render() {
    const {
      onSubmit,
    } = this.props;

    // TODO check browser compat
    const style = {
      display: 'flex',
      justifyContent: 'center',
    };

    // TODO dice icon to randomize name
    // TODO get color picker better centered
    // TODO more circle color options
    return (
      <Segment.Group style={style}>
        <Segment>
          <Header as="h1" style={style}>
            Guess a Sketch
          </Header>
        </Segment>
        <Segment>
          <Form 
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit(this.state.nickname, this.state.color);
            }}
            >
            <Form.Input
              style={style}
              inline
              label='Name'
              type='text'
              value={this.state.nickname}
              onChange={this.onNicknameChange} />
            <CirclePicker
              style={style}
              circleSize={35}
              color={this.state.color}
              onChangeComplete={this.onColorChange} />
            <br />
            <Button
              fluid
              type="submit" >
              Go
            </Button>
          </Form>
        </Segment>
      </Segment.Group>
    );
  }
}

LoginPageView.propTypes = {
  onSubmit: React.PropTypes.func,
};
