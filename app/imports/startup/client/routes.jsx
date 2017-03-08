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
import RoomListContainer from '../../ui/containers/RoomListContainer.jsx';
import LoginPage from '../../ui/pages/participant/LoginPage.jsx';
import ParticipantGameScreenContainer from '../../ui/containers/ParticipantGameScreenContainer.jsx';

import HostContainer from '../../ui/containers/HostContainer.jsx';
import CreateARoom from '../../ui/pages/host/CreateARoom.jsx';
import WelcomePageContainer from '../../ui/containers/WelcomePageContainer.jsx';
import HostGameScreen from '../../ui/pages/host/HostGameScreen.jsx';
import CollageScreen from '../../ui/pages/host/CollageScreen.jsx';
import Scoreboard from '../../ui/pages/host/Scoreboard.jsx';

// TODO i18n // i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={browserHistory}>

    <Route path="/" component={ParticipantContainer}>
      <Route path="join" component={RoomListContainer} />
      <Route path="play" component={ParticipantGameScreenContainer} />
    </Route>

    <Route path="host" component={HostContainer}>
      <Route path="create" component={CreateARoom} />
      <Route path="lobby" component={WelcomePageContainer} />
      <Route path="play" component={HostGameScreen} />
      <Route path="collage" component={CollageScreen} />
      <Route path="game-over" component={Scoreboard} />
    </Route>

  </Router>
);
