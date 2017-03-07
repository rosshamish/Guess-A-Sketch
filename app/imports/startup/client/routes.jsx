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
import WaitingPage from '../../ui/pages/participant/WaitingPage.jsx';
import ParticipantResultsScreen from '../../ui/pages/participant/ParticipantResultsScreen.jsx';
import IndividualScoreboard from '../../ui/pages/participant/IndividualScoreboard.jsx';

import HostContainer from '../../ui/containers/HostContainer.jsx';
import CreateARoom from '../../ui/pages/host/CreateARoom.jsx';
import WelcomePage from '../../ui/pages/host/WelcomePage.jsx';
import HostGameScreen from '../../ui/pages/host/HostGameScreen.jsx';
import CollageScreen from '../../ui/pages/host/CollageScreen.jsx';
import Scoreboard from '../../ui/pages/host/Scoreboard.jsx';

// TODO i18n // i18n.setLocale('en');

// TODO Instead of specifying mode="teams" errywhere here,
// we should probably get the mode from the server.
// Or, just only have the one mode, and remove the
// property. Decide later.
export const renderRoutes = () => (
  <Router history={browserHistory}>

    <Route path="/" component={ParticipantContainer}>
      <Route path="join" component={RoomListContainer} />
      <Route path="lobby" component={WaitingPage} mode="teams" />
      <Route path="play" component={ParticipantGameScreenContainer} mode="teams" />
      <Route path="round-over" component={ParticipantResultsScreen} mode="teams"/>
      <Route path="game-over" component={IndividualScoreboard} mode="teams" />
    </Route>

    <Route path="host" component={HostContainer}>
      <Route path="create" component={CreateARoom} />
      <Route path="lobby" component={WelcomePage} />
      <Route path="play" component={HostGameScreen} />
      <Route path="collage" component={CollageScreen} />
      <Route path="game-over" component={Scoreboard} />
    </Route>

  </Router>
);
