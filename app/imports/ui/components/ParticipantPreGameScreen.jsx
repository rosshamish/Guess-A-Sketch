import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Canvas from './Canvas.jsx';
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
      <Segment.Group>
        <Segment>
          <Header size="huge">
            {room.name}
            <Label
              circular
              size="large"
              color={player.color}>
              {player.name}
            </Label>
          </Header>
        </Segment>
        <Segment>
          <p>Feel free to draw while you wait for the game to start</p>
          <Canvas color={player.color} onChange={onCanvasChange} />
        </Segment>
      </Segment.Group>
    );
  }
}

ParticipantPreGameScreen.propTypes = {
  room: React.PropTypes.object,
  player: React.PropTypes.object,
  onCanvasChange: React.PropTypes.func,
};
