// Attribution:
// Used template from meteor/todos.
// MIT License: https://github.com/meteor/todos/blob/master/LICENSE.txt
// File: https://github.com/meteor/todos/blob/react/imports/ui/containers/AppContainer.jsx
// Accessed: March 2, 2017

import { Meteor } from 'meteor/meteor';
// XXX: Session
// import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// import { Lists } from '../../api/lists/lists.js';
import App from '../layouts/App.jsx';

export default createContainer(() => {
  // const publicHandle = Meteor.subscribe('lists.public');
  // const privateHandle = Meteor.subscribe('lists.private');
  return {
    user: Meteor.user,
    loading: false,
    connected: Meteor.status().connected,
  };
}, App);
