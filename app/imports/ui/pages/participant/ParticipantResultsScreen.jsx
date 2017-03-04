import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

export default class ParticipantResultsScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      sketch,
    } = this.props;

    return (
      <p>A pic of the sketch will be here! And the scoring results!</p>
    );
  }
}

ParticipantResultsScreen.propTypes = {
  sketch: React.PropTypes.object,
};
