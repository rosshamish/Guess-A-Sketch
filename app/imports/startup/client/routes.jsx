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
import RoomListPage from '../../ui/pages/participant/RoomListPage.jsx';
import LoginPage from '../../ui/pages/participant/LoginPage.jsx';
import ParticipantGameScreen from '../../ui/pages/participant/ParticipantGameScreen.jsx';
import WaitingPage from '../../ui/pages/participant/WaitingPage.jsx';
import ParticipantResultsScreen from '../../ui/pages/participant/ParticipantResultsScreen.jsx';
import IndividualScoreboard from '../../ui/pages/participant/IndividualScoreboard.jsx';

import HostContainer from '../../ui/containers/HostContainer.jsx';
import CreateARoom from '../../ui/pages/host/CreateARoom.jsx';
import WelcomePage from '../../ui/pages/host/WelcomePage.jsx';
import CollageScreen from '../../ui/pages/host/CollageScreen.jsx';
import Scoreboard from '../../ui/pages/host/Scoreboard.jsx';

import NullPage from '../../ui/pages/NullPage.jsx';

// TODO i18n // i18n.setLocale('en');

// TODO /rooms -> Rooms, and page Rooms figures out if there are rooms available or not
export const renderRoutes = () => (
  <Router history={browserHistory}>

    <Route path="/" component={ParticipantContainer}>
      <Route path="rooms" component={RoomListPage} />
      <Route path="join" component={LoginPage} />
      <Route path="lobby" component={WaitingPage} />
      <Route path="play" component={ParticipantGameScreen} />
      <Route path="round-over" component={ParticipantResultsScreen} />
      <Route path="game-over" component={IndividualScoreboard} />
    </Route>

    <Route path="host" component={HostContainer}>
      <Route path="create" component={CreateARoom} />
      <Route path="lobby" component={WelcomePage} />
      <Route path="collage" component={CollageScreen} />
      <Route path="game-over" component={Scoreboard} />
    </Route>

  </Router>
);
