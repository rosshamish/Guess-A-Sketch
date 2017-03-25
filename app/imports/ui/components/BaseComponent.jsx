// Attribution:
// Used boilerplate from meteor/todos.
// MIT License: https://github.com/meteor/todos/blob/master/LICENSE.txt
// File: https://github.com/meteor/todos/blob/react/imports/startup/server/index.js
// Accessed: March 2, 2017

import { Component } from 'react';
// TODO support i18n
// import i18n from 'meteor/universe:i18n';

class BaseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // locale: i18n.getLocale(),
    };
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
  }

  componentWillMount() {
    // i18n.onChangeLocale(this.handleLocaleChange);
  }

  componentWillUnmount() {
    // i18n.offChangeLocale(this.handleLocaleChange);
  }

  handleLocaleChange(locale) {
    // this.setState({ locale });
  }
}

export default BaseComponent;
