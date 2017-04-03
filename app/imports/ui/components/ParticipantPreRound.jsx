import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage, { errorCodes } from './ErrorMessage.jsx';
import Prompt from './Prompt.jsx';
import Timer from './Timer.jsx';
import PlayerHeader from './PlayerHeader.jsx';
import {
  Header,
  Container,
  Label,
  Segment,
} from 'semantic-ui-react';

export default class ParticipantPreRound extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      room,
      round,
      player,
    } = this.props;

    if (!room) {
      return <ErrorMessage code={errorCodes.participant.noRoom} />;
    }
    if (!round) {
      return <ErrorMessage code={errorCodes.participant.noRound} />;
    }

    return (
      <Segment.Group>
        <Segment>
          <PlayerHeader
            text={`Round ${round.index+1}`}
            player={player} />
        </Segment>
        <Segment size='massive' textAlign='center'>
          <Header as='h2'>
              <Timer
                time={3}
                text="Start Drawing In "
                floated=""
              />
          </Header>
          <Header as='h3'>
            Prompt: {round.prompt}
          </Header>
        </Segment>
      </Segment.Group>
    );
  }
}

ParticipantPreRound.propTypes = {
  room: React.PropTypes.object,
  round: React.PropTypes.object,
  player: React.PropTypes.object,
};
