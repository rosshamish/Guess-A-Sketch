// Host Layout
// Responsibilities:
//   TODO

import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class HostLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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
    console.log('HostLayout rendering');

    return (
      <div id="container">
        <div id="content-container">
          <h1>Host says Hello World!</h1>
        </div>
      </div>
    );
  }
}

// HostLayout.propTypes = {
//   user: React.PropTypes.object,      // current meteor user
//   loading: React.PropTypes.bool,     // subscription status
//   location: React.PropTypes.object,  // current router location
//   params: React.PropTypes.object,    // parameters of the current route
// };

// HostLayout.contextTypes = {
//   router: React.PropTypes.object,
// };