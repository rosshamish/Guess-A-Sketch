import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import {
  Label,
  Header,
} from 'semantic-ui-react';


export default class Prompt extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { prompt } = this.props;

    return (
      <Header
        size="large" >
        <strong>{prompt}</strong>
      </Header>
    );
  }
}

Prompt.propTypes = {
  prompt: React.PropTypes.string,
};
