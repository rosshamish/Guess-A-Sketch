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

import WelcomePage from '../../ui/pages/WelcomePage.jsx';

import RoomListContainer from '../../ui/containers/RoomListContainer.jsx';
import LoginPageContainer from '../../ui/containers/LoginPageContainer.jsx';
import ParticipantGameScreenContainer from '../../ui/containers/ParticipantGameScreenContainer.jsx';

import HostContainer from '../../ui/containers/HostContainer.jsx';
import HostCreateRoomContainer from '../../ui/containers/HostCreateRoomContainer.jsx';
import HostGameScreenContainer from '../../ui/containers/HostGameScreenContainer.jsx';

// TODO i18n // i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={browserHistory}>

    <Route path="/" component={WelcomePage} />

    <Route path="login" component={LoginPageContainer} />
    <Route path="join" component={RoomListContainer} />
    <Route path="play" component={ParticipantGameScreenContainer} />

    <Route path="host" component={HostContainer}>
      <Route path="create" component={HostCreateRoomContainer} />
      <Route path="play" component={HostGameScreenContainer} />
    </Route>

  </Router>
);
