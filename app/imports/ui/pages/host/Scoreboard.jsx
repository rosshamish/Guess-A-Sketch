import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import { browserHistory } from 'react-router';

export default class Scoreboard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onReturnToMainMenu(event){
    event.preventDefault();
    browserHistory.push('/host/create');
  }

  render() {
    const {} = this.props;

    return (
      <div>
      <p>Will display overall scoreboard.</p>
      <form onSubmit={this.onReturnToMainMenu}>
        <button>Return to Main Menu</button>
      </form>
      </div>
    );
  }
}

Scoreboard.propTypes = {};
