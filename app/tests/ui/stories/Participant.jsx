import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { players, rooms, sketches } from './constants';

import { fabric } from 'fabric';
import trimCanvasToSketch from '/imports/trim-canvas';

import LoginPageView from '/imports/ui/pages/participant/LoginPageView.jsx';
import RoomListPageView from '/imports/ui/pages/participant/RoomListPageView.jsx';
import ParticipantPreGameScreen from '/imports/ui/components/ParticipantPreGameScreen.jsx';
import ParticipantEndGameScreen from '/imports/ui/components/ParticipantEndGameScreen.jsx';
import ParticipantPreRound from '/imports/ui/components/ParticipantPreRound.jsx';
import ParticipantPlayRound from '/imports/ui/components/ParticipantPlayRound.jsx';
import ParticipantRoundResults from '/imports/ui/components/ParticipantRoundResults.jsx';
import ParticipantJoiningBetweenRounds from '/imports/ui/components/ParticipantJoiningBetweenRounds.jsx';

storiesOf('Participant', module)
  .add('logging in', () => (
    <LoginPageView
      onSubmit={action('logging-in')}
    />
  ))
  .add('joining a room', () => (
    <RoomListPageView
      rooms={rooms}
      player={players[0]}
      onRoomClickHandler={function(args) {
        action('room-click')(args);
      }}
    />
  ))
  .add('joining a room (no rooms)', () => (
    <RoomListPageView
      rooms={[]}
      player={players[0]}
    />
  ))
  .add('joining a room (loading)', () => (
    <RoomListPageView
      loading
    />
  ))
  .add('pre game', () => (
    <ParticipantPreGameScreen
      room={rooms[0]}
      player={players[0]}
    />
  ))
  .add('pre round', () => (
    <ParticipantPreRound
      room={rooms[0]}
      round={rooms[0].rounds[1]}
      player={players[0]}
    />
  ))
  .add('playing round', () => (
    <ParticipantPlayRound
      round={rooms[0].rounds[1]}
      player={players[0]}
      onRoundOver={(args) => {
        action('round-over')(args);
      }}
    />
  ))
  .add('round results', () => (
    <ParticipantRoundResults
      room={rooms[0]}
      round={rooms[0].rounds[0]}
      player={players[0]}
      sketch={sketches[0]}
      getSketchScore={() => 50}
    />
  ))
  .add('round results (loading)', () => (
    <ParticipantRoundResults
      room={rooms[0]}
      round={rooms[0].rounds[0]}
      player={players[1]}
      sketch={sketches[1]}
      getSketchScore={() => 50}
    />
  ))
  .add('round results (joining between rounds)', () => (
    <ParticipantJoiningBetweenRounds
      room={rooms[0]}
      round={rooms[0].rounds[0]}
      player={players[0]}
    />
  ))
  .add('post game', () => (
    <ParticipantEndGameScreen
      room={rooms[0]}
      player={players[0]}
      getRoundScore={() => 50}
      getGameScore={() => 100}
    />
  ))
