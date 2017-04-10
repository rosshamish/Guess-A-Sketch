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
} from 'semantic-ui-react';


export default class WelcomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      aboutModalOpen: false,
    };

    this.handleAboutOpen = this.handleAboutOpen.bind(this);
    this.handleAboutClose = this.handleAboutClose.bind(this);
  }

  onClickPlay(event) {
    event.preventDefault();
    browserHistory.push('/login');
  }

  onClickHost(event) {
    event.preventDefault();
    browserHistory.push('/host/create');
  }

  onClickDoodle(event) {
    event.preventDefault();
    browserHistory.push('/doodle');
  }

  handleAboutOpen(event) {
    this.setState({ aboutModalOpen: true });
  }

  handleAboutClose(event) {
    this.setState({ aboutModalOpen: false });
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

    return (
      <Segment.Group>
        <Segment>
          <Header as='h1' icon textAlign='center'>
            <Icon name='write' circular />
            <Header.Content>
              Guess A Sketch
              <Header.Subheader as='h4'>Half party game, half AI experiment</Header.Subheader>
            </Header.Content>
          </Header>
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
              <Button toggle size="medium" onClick={this.handleAboutOpen} style={style}>About</Button>
            } 
            basic size='small'
            open={this.state.aboutModalOpen}
            onClose={this.handleAboutClose}
          >
            <Modal.Header content='About Guess-A-Sketch' />
            <Modal.Content>
              <p>
                Each round, you get a prompt (eg "cat"). Draw it! 
                Well, as best you can, until the timer runs out. 
                Get points based on the quality of your drawing.
              </p>
              <p>
                Points are awarded by a program which can recognize objects
                in napkin-quality sketches. The program learns how to do this
                using neural networks - that's the AI experiment.
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Button color='green' onClick={this.handleAboutClose}>
                <Icon name='checkmark' />Cool!
              </Button>
            </Modal.Actions>
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
