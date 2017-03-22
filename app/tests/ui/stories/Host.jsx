import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { rooms, sketches } from './constants';

import CreateARoomView from '/imports/ui/pages/host/CreateARoomView.jsx';
import HostPreGameScreen from '/imports/ui/components/HostPreGameScreen.jsx';
import HostEndGameScreen from '/imports/ui/components/HostEndGameScreen.jsx';
import HostPreRound from '/imports/ui/components/HostPreRound.jsx';
import HostPlayRound from '/imports/ui/components/HostPlayRound.jsx';
import HostRoundResults from '/imports/ui/components/HostRoundResults.jsx';

storiesOf('Host', module)
  .add('creating a room', () => (
    <CreateARoomView
      onCreateRoom={(args) => {
        action('create-room')(args);
      }}
    />
  ))
  .add('creating a room (loading)', () => (
    <CreateARoomView
      loading
    />
  ))
  .add('pre game', () => (
    <HostPreGameScreen
      room={rooms[0]}
      onStartGame={action('start-game')}
    />
  ))
  .add('pre round', () => (
    <HostPreRound
      room={rooms[0]}
      round={rooms[0].rounds[1]}
      onPlayRound={action('play-round')}
    />
  ))
  .add('playing round', () => (
    <HostPlayRound
      room={rooms[0]}
      round={rooms[0].rounds[1]}
      onRoundTimerOver={action('round-over')}
    />
  ))
  .add('round results', () => (
    <HostRoundResults
      room={rooms[0]}
      round={rooms[0].rounds[1]}
      sketches={sketches}
      isLastRound={() => false}
      onRoundTimerOver={action('round-over')}
    />
  ))
  .add('round results (last round)', () => (
    <HostRoundResults
      room={rooms[0]}
      round={rooms[0].rounds[1]}
      sketches={sketches}
      isLastRound={() => true}
      onRoundTimerOver={action('game-over')}
    />
  ))
  .add('post game', () => (
    <HostEndGameScreen
      room={rooms[0]}
      getGameScore={() => 100}
    />
  ))
