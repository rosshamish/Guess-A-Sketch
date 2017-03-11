import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class ErrorMessage extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { } = this.props;

    return (
      <div className="error-message">
        Whoops! Something went wrong. Check the console.
      </div>
    );
  }
}

ErrorMessage.propTypes = {
};
