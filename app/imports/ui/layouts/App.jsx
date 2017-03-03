// Attribution:
// Used template from meteor/todos.
// MIT License: https://github.com/meteor/todos/blob/master/LICENSE.txt
// File: https://github.com/meteor/todos/blob/react/imports/ui/layouts/App.jsx
// Accessed: March 2, 2017

import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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
      loading,
      location,
      params,
    } = this.props;

    console.log('App.jsx render()');

    return (
      <div id="container">
        <div id="content-container">
          <h1>Hello World!</h1>
          <p>Loading: {loading}</p>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object,      // current meteor user
  loading: React.PropTypes.bool,     // subscription status
  location: React.PropTypes.object,  // current router location
  params: React.PropTypes.object,    // parameters of the current route
};

App.contextTypes = {
  router: React.PropTypes.object,
};