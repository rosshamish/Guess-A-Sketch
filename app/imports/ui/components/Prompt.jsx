import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class Prompt extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { prompt } = this.props;

    return (
      <div className="prompt">
        Prompt: {prompt}
      </div>
    );
  }
}

Prompt.propTypes = {
  prompt: React.PropTypes.string,
};
