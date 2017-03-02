// Attribution:
// Used template from meteor/todos.
// MIT License: https://github.com/meteor/todos/blob/master/LICENSE.txt
// File: https://github.com/meteor/todos/blob/react/imports/startup/client/routes.jsx
// Accessed: March 2, 2017
//
// Purpose: set up routes, i.e. the table mapping
// URL to UI.
// e.g. http://join -> render(ui.pages.join)

import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
// TODO i18n // import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';

// TODO i18n // i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="host" component={AppContainer} />
      <Route path="join" component={AppContainer} />
      <Route path="play" component={AppContainer} />
      <Route path="*" component={AppContainer} />
    </Route>
  </Router>
);
