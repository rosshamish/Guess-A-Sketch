import React from 'react';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import { PLAYER } from '/imports/api/session';

import BaseComponent from './BaseComponent.jsx';
import Canvas from './Canvas.jsx';
import ErrorMessage from './ErrorMessage.jsx';

import {
  Label,
  Container,
  Header,
  Divider,
} from 'semantic-ui-react';


export default class ParticipantPreGameScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      loading,
      room,
    } = this.props;

    const player = Session.get(PLAYER);

    if (loading) {
      return (
        <p>Loading...</p>
      );
    } else {
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
            <Canvas prompt="" player={player} />
          </Container>
        </Container>
      );
    }
  }
}

ParticipantPreGameScreen.propTypes = {
  loading: React.PropTypes.bool,
  room: React.PropTypes.object,
};
