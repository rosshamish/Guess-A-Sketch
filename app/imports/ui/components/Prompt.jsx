import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';

import BaseComponent from './BaseComponent.jsx';
import {
  Label,
} from 'semantic-ui-react';


export default class Prompt extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { prompt } = this.props;

    return (
      <Label>
        Draw a <strong>{prompt}</strong>
      </Label>
    );
  }
}

Prompt.propTypes = {
  prompt: React.PropTypes.string,
};
