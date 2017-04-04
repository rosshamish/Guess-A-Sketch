import React from 'react';
import BaseComponent from './BaseComponent.jsx';
import {
  Segment,
  Header,
} from 'semantic-ui-react';

export default class GenericLoading extends BaseComponent {
  render() {
    return (
      <Segment loading style={{height: '100vh'}}>
        <Header as="h1">Loading...</Header>
      </Segment>
    );
  }
}
