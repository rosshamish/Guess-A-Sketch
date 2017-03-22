import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import Canvas from './Canvas.jsx';
import {
  Label,
  Container,
  Header,
  Divider,
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
      <Container>
        <Container>
          <Header size="huge">{room.name}</Header>
          <Label 
            circular
            size="large"
            color={player.color}>
            {player.name}
          </Label>
        </Container>
        <Divider />
        <Container>
          <p>Feel free to draw while you wait for the game to start</p>
          <Canvas prompt="" player={player} onChange={onCanvasChange} />
        </Container>
      </Container>
    );
  }
}

ParticipantPreGameScreen.propTypes = {
  room: React.PropTypes.object,
  player: React.PropTypes.object,
  onCanvasChange: React.PropTypes.func,
};
