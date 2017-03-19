import React from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';

import { Button } from 'semantic-ui-react'

export default class WelcomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // a lifecycle hook for us to use.
    // Fires when React mounts the component in the view.
  }

  componentWillReceiveProps({ }) {
    // a lifecycle hook for us to use
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

    return (
      <div id="container">
        <div id="content-container">
          <h1>Guess a Sketch!</h1>
          <p>Half party game, half science project.</p>
          <p>Each round, you get a prompt (eg "Cat"). Draw it! 
          Well, as best you can, until the timer runs out. 
          Get points based on the speed and quality of your drawing.
          </p>
          <p>Points are awarded by an AI that has learned to recognize objects
          in napkin-quality sketches. The AI learns using a variety of neural networks - that's the
          science project part.
          </p>
          <hr />
          <div>
            <button className="ui button" onClick={this.onClickPlay}>Play</button>
            <button className="ui button" onClick={this.onClickHost}>Host</button>
          </div>
        </div>
      </div>
    );
  }
}

WelcomePage.propTypes = {
};

WelcomePage.contextTypes = {
  router: React.PropTypes.object,
}; 
