// Attribution:
// Used template from meteor/todos.
// MIT License: https://github.com/meteor/todos/blob/master/LICENSE.txt
// File: https://github.com/meteor/todos/blob/react/imports/startup/client/routes.jsx
// Accessed: March 2, 2017
//
// Responsibilites:
//   Map URL routes to Containers (/startup/ui/containers/)
// e.g. http://join -> render(ui.containers.join)

import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
// TODO i18n // import i18n from 'meteor/universe:i18n';

// route components
import ParticipantContainer from '../../ui/containers/ParticipantContainer.jsx';
import HostContainer from '../../ui/containers/HostContainer.jsx';
import NullPage from '../../ui/pages/NullPage.jsx';

// TODO i18n // i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={ParticipantContainer}>
      <Route path="rooms" component={NullPage} />
      <Route path="join" component={NullPage} />
      <Route path="play" component={NullPage} />
    </Route>
    <Route path="host" component={HostContainer}>
      <Route path="create" component={NullPage} />
      <Route path="welcome" component={NullPage} />
    </Route>
  </Router>
);
