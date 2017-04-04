import React from 'react';
import BaseComponent from './BaseComponent.jsx';
import {
  Segment,
  Header,
} from 'semantic-ui-react';

export default class GenericLoading extends BaseComponent {
  render() {
    return (
      <Segment loading>
        <Header as="h1">Loading...</Header>
      </Segment>
    );
  }
}
