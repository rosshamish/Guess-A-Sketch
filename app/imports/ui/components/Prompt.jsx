import React from 'react';

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
        Drawing Prompt: <strong>{prompt}</strong>
      </Label>
    );
  }
}

Prompt.propTypes = {
  prompt: React.PropTypes.string,
};
