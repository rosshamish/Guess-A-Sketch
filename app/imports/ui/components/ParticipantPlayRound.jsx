import React from 'react';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import {
  PLAYER,
  SKETCH,
} from '/imports/api/session';

import { submitSketch } from '/imports/api/methods';

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
    const didSubmitSketch = submitSketch.call({
      sketch: {
        player: Session.get(PLAYER),
        sketch: Session.get(SKETCH),
        prompt: this.props.round.prompt,
      },
      roundIndex: this.props.round.index,
    });
    if (!didSubmitSketch) {
      console.error('Failed to submit sketch');
      return;
    }
  }

  render() {
    const { round } = this.props;

    return (
      <Container>
        <Label.Group
          size="huge"
          fluid
        >
          <Prompt prompt={round.prompt} />
          <Timer
            time={round.time}
            text="Remaining: "
          />
        </Label.Group>
        <Canvas prompt={round.prompt} player={Session.get(PLAYER)} />
      </Container>
    );
  }
}

ParticipantPlayRound.propTypes = {
  round: React.PropTypes.object,
};
