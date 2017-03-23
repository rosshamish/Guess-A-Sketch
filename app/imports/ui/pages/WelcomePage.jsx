import React from 'react';
import { browserHistory } from 'react-router';

import {
  Button,
  Header,
  Icon,
  Image,
  Segment,
  Container,
} from 'semantic-ui-react'

export default class WelcomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      about: false,
    };

    this.onClickAbout = this.onClickAbout.bind(this);
  }

  onClickPlay(event) {
    event.preventDefault();
    browserHistory.push('/login');
  }

  onClickHost(event) {
    event.preventDefault();
    browserHistory.push('/host/create');
  }

  onClickAbout(event) {
    event.preventDefault();
    this.setState({
      about: !this.state.about,
    });
  }

  render() {
    const {
      user,
      location,
      params,
      children,
      message,
    } = this.props;

    const aboutStyle = {
      visibility: this.state.about ? 'visible' : 'hidden',
    };

    const style = {
      display: 'flex',
      justifyContent: 'center',
    };

    // TODO logo instead of header text
    return (
      <Segment.Group>
        <Segment>
          <Header as='h2' icon textAlign='center'>
            Guess A Sketch
          </Header>
          <Header
            as='h4'
            textAlign="center">Half party game, half science project.</Header>
        </Segment>
        <Segment>
          <Button.Group style={style} size="big">
            <Button primary onClick={this.onClickPlay}>Play</Button>
            <Button.Or />
            <Button onClick={this.onClickHost}>Host</Button>
          </Button.Group>
          <br />
          <Button toggle size="big" style={style} fluid onClick={this.onClickAbout}>About</Button>
          <Header as='h5' style={aboutStyle}>
            Each round, you get a prompt (eg "Cat"). Draw it! 
            Well, as best you can, until the timer runs out. 
            Get points based on the speed and quality of your drawing.
          </Header>
          <Header as='h5' style={aboutStyle}>
            Points are awarded by a program that has learned to recognize objects
            in napkin-quality sketches. The program learns using neural networks - that's the
            science project part.
          </Header>
        </Segment>
      </Segment.Group>
    );
  }
}

WelcomePage.propTypes = {
};

WelcomePage.contextTypes = {
  router: React.PropTypes.object,
}; 
