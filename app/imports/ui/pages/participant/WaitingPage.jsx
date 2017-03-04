import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

export default class WaitingPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    const {
    } = this.props;

    return (
      <p>Waiting for the game to start. Kick back + relax for now!</p>
    );
  }
}

WaitingPage.propTypes = {
};
