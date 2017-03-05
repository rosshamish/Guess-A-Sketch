import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

export default class WelcomePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      rooms,
    } = this.props;


    let WelcomePage;
    if (!rooms || !rooms.length) {
      WelcomePage = (
        <h3>Error setting up your room. Please try again.</h3>
      );
    } else {
      WelcomePage = (
        <div>
        <h3>Welcome!</h3>
        <p>Room Code: ??</p>
        </div>
      );
    }

    return WelcomePage; 

  }
}

WelcomePage.propTypes = {
  room: React.PropTypes.array,
};
