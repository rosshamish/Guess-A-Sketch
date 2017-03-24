import React from 'react';
import { browserHistory } from 'react-router';

import {
  Button,
  Header,
  Icon,
  Image,
  Segment,
  Container,
  Modal,
} from 'semantic-ui-react'

export default class WelcomePage extends React.Component {

  constructor(props) {
    super(props);
  }

  onClickPlay(event) {
    event.preventDefault();
    browserHistory.push('/login');
  }

  onClickHost(event) {
    event.preventDefault();
    browserHistory.push('/host/create');
  }

  render() {
    const {
      user,
      location,
      params,
      children,
      message,
    } = this.props;

    const style = {
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
            textAlign="center">Half party game, half AI experiment</Header>
        </Segment>
        <Segment textAlign='center'>
          <Button.Group style={style} size="big">
            <Button primary onClick={this.onClickPlay}>Play</Button>
            <Button.Or />
            <Button onClick={this.onClickHost}>Host</Button>
          </Button.Group>
          <br />
          <br />
          <Modal 
            trigger={
              <Button toggle size="large" style={style}>About</Button>
            } 
            basic size='small'
          >
            <Header content='About Guess-A-Sketch' />
            <Modal.Content>
              <p>
                Each round, you get a prompt (eg "Cat"). Draw it! 
                Well, as best you can, until the timer runs out. 
                Get points based on the speed and quality of your drawing.
              </p>
              <p>
                Points are awarded by a program that has learned to recognize objects
                in napkin-quality sketches. The program learns using neural networks - that's the
                science project part.
              </p>
            </Modal.Content>
          </Modal>
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
