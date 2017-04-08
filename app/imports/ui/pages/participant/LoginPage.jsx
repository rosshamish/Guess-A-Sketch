import React from 'react';
import { _ } from 'underscore';
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
    // Name uniqueness is handled by LoginPageView.
    Session.setPersistent(PLAYER, { name, color });
    browserHistory.push('/join');
  }

  render() {
    return (
      <LoginPageView
        loading={this.props.loading}
        namesInUse={this.props.namesInUse}
        onSubmit={this.onSubmit}
      />
    );
  }
}

LoginPage.propTypes = {
  loading: React.PropTypes.bool,
  namesInUse: React.PropTypes.array,
};
