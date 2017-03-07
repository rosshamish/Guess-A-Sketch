// Participant Layout
// Responsibilites:
//   TODO

import React from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';

export default class ParticipantLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // a lifecycle hook for us to use.
    // Fires when React mounts the component in the view.
  }

  componentWillReceiveProps({ }) {
    // a lifecycle hook for us to use
  }

  logout() {
    Meteor.logout();
  }

  onClickPlay(event) {
    event.preventDefault();
    browserHistory.push('/join');
  }

  onClickHost(event) {
    event.preventDefault();
    browserHistory.push('/host');
  }

  render() {
    const {
      user,
      location,
      params,
      children,
      message,
    } = this.props;

    console.log('ParticipantLayout rendering');

    return (
      <div id="container">
        <div id="content-container">
          <h1>Guess a Sketch!</h1>
          <p>Half party game, half science project.</p>
          <p>Each round, you get a prompt (eg "Cat"). Draw it! 
          Well, as best you can, until the timer runs out. 
          Get points based on the speed and quality of your drawing.
          </p>
          <p>Message: "{message}"</p>
          <hr />
          { !!children ?
            children :
            <div>
              <button onClick={this.onClickPlay}>Play</button>
              <button onClick={this.onClickHost}>Host</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

ParticipantLayout.propTypes = {
  user: React.PropTypes.object,      // current meteor user
  location: React.PropTypes.object,  // current router location
  params: React.PropTypes.object,    // parameters of the current route
  children: React.PropTypes.element,
  message: React.PropTypes.string,
};

ParticipantLayout.contextTypes = {
  router: React.PropTypes.object,
};
