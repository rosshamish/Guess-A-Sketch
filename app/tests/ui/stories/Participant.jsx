import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import LoginPageView from '/imports/ui/pages/participant/LoginPageView.jsx';
import RoomListPageView from '/imports/ui/pages/participant/RoomListPageView.jsx';
import ParticipantPreGameScreen from '/imports/ui/components/ParticipantPreGameScreen.jsx';
import ParticipantEndGameScreen from '/imports/ui/components/ParticipantEndGameScreen.jsx';
import ParticipantPreRound from '/imports/ui/components/ParticipantPreRound.jsx';
import ParticipantPlayRound from '/imports/ui/components/ParticipantPlayRound.jsx';
import ParticipantRoundResults from '/imports/ui/components/ParticipantRoundResults.jsx';

const players = [{
  name: "Alice",
  color: "red",
  }, {
  name: "Bob",
  color: "blue",
  }, {
  name: "Eve",
  color: "black",
}];
// TODO put a real sketch dataURL here
const sketches = [{
  player: players[0],
  sketch: "",
  prompt: "apple",
}];
const rooms = [{
  name: "Playtest 1",
  rounds: [{
    index: 0,
    prompt: "apple",
    sketches: sketches,
    time: 10,
    status: "RESULTS",
  }, {
    index: 1,
    prompt: "banana",
    sketches: [],
    time: 10,
    status: "CREATED",
  }],
  players: players,
  status: "JOINABLE",
  }, {
  name: "ECE Design Showcase",
  rounds: [],
  players: players.concat(players),
  status: "JOINABLE",
  }, {
  name: "Development (Playing)",
  rounds: [],
  players: players,
  status: "PLAYING",
  }, {
  name: "Should not see this",
  rounds: [],
  players: [],
  status: "COMPLETE",
}];

storiesOf('Participant', module)
  .add('logging in', () => (
    <LoginPageView
      onSubmit={action('logging-in')}
    />
  ))
  .add('joining a room', () => (
    <RoomListPageView
      rooms={rooms}
      onRoomClickHandler={function(args) {
        action('room-click')(args);
      }}
    />
  ))
  .add('joining a room (no rooms)', () => (
    <RoomListPageView
      rooms={[]}
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
      sketches={rooms[0].rounds[0].sketches}
      getRoundScore={() => 50}
    />
  ))
  .add('round results (joining between rounds)', () => (
    <ParticipantRoundResults
      room={rooms[0]}
      round={rooms[0].rounds[0]}
      player={players[0]}
      sketches={[]}
      getRoundScore={() => 50}
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
