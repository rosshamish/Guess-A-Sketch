import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Canvas from './Canvas.jsx';
import Timer from './Timer.jsx';
import {
  Container,
  Label,
} from 'semantic-ui-react';


export default class ParticipantPlayRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    // Submit sketch before leaving this page.
    this.props.onRoundOver(this.props.round.prompt, this.props.round.index);
  }

  render() {
    const { 
      round,
      player,
    } = this.props;

    return (
      <Container>
        <Label.Group size="huge">
          <Prompt prompt={round.prompt} />
          <Timer
            time={round.time}
            text="Remaining: "
          />
        </Label.Group>
        <Canvas prompt={round.prompt} player={player} />
      </Container>
    );
  }
}

ParticipantPlayRound.propTypes = {
  round: React.PropTypes.object,
  player: React.PropTypes.object,
  onRoundOver: React.PropTypes.func,
};
