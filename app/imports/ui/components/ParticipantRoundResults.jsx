import React from 'react';
import BaseComponent from './BaseComponent.jsx';

export default class ParticipantRoundResults extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      round,
    } = this.props;

    return (
      <p>A pic of the sketch will be here! And the scoring results!</p>
    );
  }
}

ParticipantRoundResults.propTypes = {
  round: React.PropTypes.object,
};
