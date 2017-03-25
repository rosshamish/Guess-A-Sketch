import React from 'react';

import BaseComponent from '../../components/BaseComponent.jsx';
import NoRooms from '../../components/NoRooms.jsx';
import RoomItem from '../../components/RoomItem.jsx';
import PlayerHeader from '../../components/PlayerHeader.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import {
  Container,
  Header,
  Icon,
  Card,
  Segment,
} from 'semantic-ui-react';


export default class RoomListPageView extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      loading,
      rooms,
      player,
      onRoomClickHandler,
    } = this.props;

    if (!loading && (!rooms || !player)) {
      console.error('Your session is corrupt. Reload the homepage.');
      return <ErrorMessage />;
    } else if (!loading && rooms.length === 0) {
      return <NoRooms player={player} />;
    }

    if (loading) {
      const round = { index: 0, prompt: 'apple', sketches: [], time: 10, status: 'CREATED' };
      const players = [{
        name: 'Alice',
        color: 'red',
      }, {
        name: 'Bob',
        color: 'blue',
      }, {
        name: 'Eve',
        color: 'black',
      }, {
        name: 'Frank',
        color: 'green',
      }];
      rooms = [{
        name: 'Looking for rooms',
        rounds: [round],
        players: players.concat(players).concat(players),
        status: 'JOINABLE',
      }, {
        name: 'Hopefully someone is hosting one!',
        rounds: [round],
        players: players.concat(players),
        status: 'JOINABLE',
      }, {
        name: 'Thanks for your patience.',
        rounds: [round],
        players: players,
        status: 'JOINABLE',
      }];
    }

    rooms.sort((a, b) => {
      if (!a.players) {
        return -1;
      } else if (!b.players) {
        return 1;
      } else {
        return b.players.length - a.players.length;
      }
    });
    const joinable = rooms
      .filter(room => room.status === 'JOINABLE')
      .map(room => (
        <RoomItem
          key={room.name}
          onClick={onRoomClickHandler}
          room={room}
        />
      ));
    const playing = rooms
      .filter(room => room.status === 'PLAYING')
      .map(room => (
        <RoomItem
          key={room.name}
          room={room}
        />
      ));
    return (
      <Segment.Group>
        <Segment>
          <PlayerHeader text="Rooms" player={player} />
        </Segment>
        <Segment loading={loading}>
          <Card.Group
            itemsPerRow={2} >
            {joinable}
          </Card.Group>
        </Segment>
        <Segment disabled>
          <Card.Group
            itemsPerRow={2} >
            {playing}
          </Card.Group>
        </Segment>
      </Segment.Group>
    );
  }
}



RoomListPageView.propTypes = {
  loading: React.PropTypes.bool,
  rooms: React.PropTypes.array,
  player: React.PropTypes.object,
  onRoomClickHandler: React.PropTypes.func,
};
