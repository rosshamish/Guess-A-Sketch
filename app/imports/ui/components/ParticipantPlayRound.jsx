import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Prompt from './Prompt.jsx';
import Canvas from './Canvas.jsx';
import Timer from './Timer.jsx';
import {
  Segment,
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
      onCanvasChange,
    } = this.props;

    // TODO proper fullscreen instead of height: 90vh
    return (
      <Segment.Group style={{
        height: '90vh',
      }}>
        <Segment.Group horizontal>
          <Segment>
            <Prompt prompt={round.prompt} />
          </Segment>
          <Segment> 
            <Timer
              time={round.time}
              text=""
              floated="right"
            />
          </Segment>
        </Segment.Group>
        <Canvas onChange={onCanvasChange} color={player.color} />
      </Segment.Group>
    );
  }
}

ParticipantPlayRound.propTypes = {
  round: React.PropTypes.object,
  player: React.PropTypes.object,
  onRoundOver: React.PropTypes.func,
  onCanvasChange: React.PropTypes.func,
};
