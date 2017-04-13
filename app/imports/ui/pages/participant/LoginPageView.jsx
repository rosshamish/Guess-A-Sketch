// SRS 3.2.1.2 : Log In Page

import React from 'react';
import { _ } from 'underscore';

import {
  randomArtistName,
  pickRandom,
} from '/imports/random-name';

import BaseComponent from '../../components/BaseComponent.jsx';
import { CirclePicker } from 'react-color';
import {
  Form,
  Icon,
  Button,
  Header,
  Segment,
  Message,
} from 'semantic-ui-react';

const semanticUIColors = [
  {
    name: 'brown',
    hex: '#A52A2A',
  },
  {
    name: 'red',
    hex: '#B03060',
  },
    {
    name: 'pink',
    hex: '#FF1493',
  },
  {
    name: 'orange',
    hex: '#FE9A76',
  },
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
      nickname: randomArtistName(),
      color: pickRandom(_.pluck(semanticUIColors, 'hex')),
    };

    this.nicknameUnique = this.nicknameUnique.bind(this);
    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
  }

  nicknameUnique() {
    const isUnique = !(_.contains(this.props.namesInUse, this.state.nickname));
    return isUnique;
  }

  onNicknameChange(event) {
    this.setState({ nickname: event.target.value });
  }

  onColorChange(color, event) {
    this.setState({ color: color.hex });
  }

  colorName(hex) {
    const color = _.find(semanticUIColors, (c) => {
      return c.hex.toLowerCase() === hex.toLowerCase();
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

    // TODO check browser compat of flex
    const style = {
      display: 'flex',
      justifyContent: 'center',
    };
    
    return (
      <Segment.Group style={style}>
        <Segment>
          <Header as="h1" style={style}>
            Create a Player
          </Header>
        </Segment>
        <Segment>
          <Form 
            error={!this.nicknameUnique()}
            onSubmit={(event) => {
              event.preventDefault();
              if (this.nicknameUnique()) {
                onSubmit(this.state.nickname, this.colorName(this.state.color));
              }
            }}
            >
            <div id='Name' style={{display: 'inline-block', width: '90%'}}>
              <Form.Input
                style={style}
                inline
                fluid
                label='Name'
                type='text'
                value={this.state.nickname}
                onChange={this.onNicknameChange} />
            </div>
            <div id='NameRandomize' style={{display: 'inline-block', width: '10%'}}>
              <Button icon onClick={(event) => {
                  event.preventDefault();
                  this.setState({nickname: randomArtistName()});
                }}>
                <Icon name='refresh' />
              </Button>
            </div>
            <div style={{color: '#FFFFFF'}}>.{"\n"}</div>
            <CirclePicker
              width = "100%"
              circleSize={35}
              color={this.state.color}
              colors={_.map(semanticUIColors, color => color.hex)}
              onChangeComplete={this.onColorChange} />
            <br />
            <Message
              error
              header='Sorry, that name is taken.'
              content='Pick a different name!'
            />
            <Button
              fluid
              primary
              disabled={!this.nicknameUnique()}
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
  namesInUse: React.PropTypes.array,
};
