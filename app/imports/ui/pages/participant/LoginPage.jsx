import React from 'react';
import { browserHistory } from 'react-router';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import BaseComponent from '../../components/BaseComponent.jsx';
import LoginPageView from '../../pages/participant/LoginPageView.jsx';


export default class LoginPage extends BaseComponent {

  constructor(props) {
    super(props);
  }

  onSubmit(name, color) {
    Session.set(PLAYER, { name, color });
    browserHistory.push('/join');
  }

  render() {
    return <LoginPageView onSubmit={this.onSubmit} />
  }
}

LoginPage.propTypes = {
};
