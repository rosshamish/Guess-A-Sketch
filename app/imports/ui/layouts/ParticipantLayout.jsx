// Participant Layout
// Responsibilites:
//   TODO

import React from 'react';
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

  render() {
    const {
      user,
      location,
      params,
      children,
        message,
    } = this.props;

    console.log('ParticipantLayout.jsx render()');

    return (
      <div id="container">
        <div id="content-container">
          <h1>Participant says Hello World!</h1>
          { children }
          <h1>{message}</h1>
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
  message: React.PropTypes.object,
};

ParticipantLayout.contextTypes = {
  router: React.PropTypes.object,
};
