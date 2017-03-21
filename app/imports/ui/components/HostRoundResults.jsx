import React from 'react';
import { _ } from 'meteor/underscore';

import { Session } from 'meteor/session';
import { HOST_ROOM } from '/imports/api/session';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import SketchImage from './SketchImage.jsx';

import { Sketches } from '/imports/api/collections/sketches';

import Component from "react-stack-grid";
import StackGrid from "react-stack-grid";

import {
  startRound,
  endRound,
  endGame,
} from '/imports/api/methods';

import { 
  currentRound,
  isLastRound,
} from '/imports/game-status';

import {
  Button,
  Header,
  Container,
} from 'semantic-ui-react';

export default class HostRoundResults extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onNextRound = this.onNextRound.bind(this);
  }

  onNextRound(event){
    event.preventDefault();

    let room = Session.get(HOST_ROOM);

    const didEndRound = endRound.call({
      room_id: room._id,
    });
    if (!didEndRound) {
      console.error('Failed to end round. Server rejected request.');
      return;
    }

    if (isLastRound(this.props.round, room)) {
      const didEndGame = endGame.call({
        room_id: room._id,
      });
      if (!didEndGame) {
        console.error('Unable to end game. Server rejected request.');
        return;
      }
    } else {
      const didStartRound = startRound.call({
        room_id: room._id,
      });
      if (!didStartRound) {
        console.error('Failed to start next round. Server rejected request.');
        return;
      }
    }
  }

  render() {
    const {
      room,
      round,
    } = this.props;

    if (!round) {
      console.error('Round is undefined, cannot render.');
      return <ErrorMessage />
    }

    const sketches = _.map(round.sketches, (sketchID) => {
      return Sketches.findOne({ _id: sketchID });
    });

    const SketchComponents = _.map(sketches, (sketch) => {
      return <div key={sketch._id}><SketchImage key={sketch._id} sketch={sketch} /></div>
    });

    return (
      <Container>
        <Header as='h1'>Sketches From This Round</Header>
        <form onSubmit={this.onNextRound}>
          <Button>
            { 
              isLastRound(round, room) ?
              'End Game' :
              'Next Round' 
            }
          </Button>
        </form>
        <StackGrid columnWidth={150}>
          {SketchComponents}
        </StackGrid>
      </Container>
    );
  }
}

HostRoundResults.propTypes = {
  room: React.PropTypes.object,
  round: React.PropTypes.object,
};
