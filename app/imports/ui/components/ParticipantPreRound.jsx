import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
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

    if (!room || !round) {
      console.error('Received illegal round or room');
      return <ErrorMessage />;
    }

    const circle = { width: 175, height: 175 }

    return (
      <Segment.Group>
        <Segment>
          <PlayerHeader
            text={`Round ${round.index+1}`}
            player={player} />
        </Segment>
        <Segment size='massive' textAlign='center'>
          <Header as='h1'>
              <Timer
                time={3}
                text="Start Drawing In "
                floated=""
              />
          </Header>
          <Header.Subheader as='h2'>
            Prompt: {round.prompt}
          </Header.Subheader>
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
