import React from 'react';
import { _ } from 'underscore';

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

const semanticUIColors = [
  {
    name: 'red',
    hex: '#B03060',
  },
  {
    name: 'orange',
    hex: '#FE9A76',
  },
  // Omit yellow. Too hard to see.
  // {
  //   name: 'yellow',
  //   hex: '#FFD700',
  // },
  {
    name: 'olive',
    hex: '#32CD32',
  },
  {
    name: 'green',
    hex: '#016936',
  },
  {
    name: 'teal',
    hex: '#008080',
  },
  {
    name: 'blue',
    hex: '#0E6EB8',
  },
  {
    name: 'violet',
    hex: '#EE82EE',
  },
  {
    name: 'purple',
    hex: '#B413EC',
  },
  {
    name: 'pink',
    hex: '#FF1493',
  },
  {
    name: 'brown',
    hex: '#A52A2A',
  },
  {
    name: 'grey',
    hex: '#A0A0A0',
  },
  {
    name: 'black',
    hex: '#000000',
  },
];

export default class LoginPageView extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      nickname: randomName(),
      color: semanticUIColors[0].hex,
    };

    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
  }

  onNicknameChange(event) {
    this.setState({ nickname: event.target.value });
  }

  onColorChange(color, event) {
    this.setState({ color: color.hex });
  }

  colorName(hex) {
    let color = _.find(semanticUIColors, (color) => {
      return color.hex.toLowerCase() === hex.toLowerCase();
    });
    if (!color) {
      console.error(`Invalid color hex ${hex} falling back to black`);
      return 'black';
    }
    return color.name;
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
              onSubmit(this.state.nickname, this.colorName(this.state.color));
            }}
            >
            <Form.Input
              style={style}
              inline
              fluid
              label='Name'
              type='text'
              value={this.state.nickname}
              onChange={this.onNicknameChange} />
            <CirclePicker
              circleSize={35}
              color={this.state.color}
              colors={_.map(semanticUIColors, (color) => color.hex)}
              onChangeComplete={this.onColorChange} />
            <br />
            <Button
              fluid
              primary
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
