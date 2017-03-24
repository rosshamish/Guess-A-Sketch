import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Canvas from './Canvas.jsx';
import PlayerHeader from './PlayerHeader.jsx';
import {
  Label,
  Container,
  Header,
  Divider,
  Segment,
} from 'semantic-ui-react';


export default class ParticipantPreGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      room,
      player,
      onCanvasChange,
    } = this.props;

    return (
      <Segment.Group style={{
        height: '80vh',
      }}>
        <Segment>
          <PlayerHeader text={room.name} player={player} />
        </Segment>
        <Segment>
          <p>The game will start soon.</p>
          <p>Feel free to draw while you wait!</p>
        </Segment>
        <Canvas color={player.color} onChange={onCanvasChange} />
      </Segment.Group>
    );
  }
}

ParticipantPreGameScreen.propTypes = {
  room: React.PropTypes.object,
  player: React.PropTypes.object,
  onCanvasChange: React.PropTypes.func,
};
