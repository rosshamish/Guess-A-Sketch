import React from 'react';
import { _ } from 'meteor/underscore';
import BaseComponent from './BaseComponent.jsx';

export default class ParticipantPlayRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { round } = this.props;

    return (
      <div className="game-screen">
        <div>
          <Prompt prompt={round.prompt} />
          <Timer time={round.time} />
        </div>
        <Canvas prompt={round.prompt} player={Session.get(PLAYER)} onTimeout={this.onTimeout} />
      </div>
    );
  }
}

ParticipantPlayRound.propTypes = {
  round: React.PropTypes.object,
};
