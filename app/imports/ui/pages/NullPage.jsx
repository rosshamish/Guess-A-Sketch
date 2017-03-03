import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';

export default class NullPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <h4>Lorem ipsum, blah blah, etc etc</h4>
    );
  }
}
