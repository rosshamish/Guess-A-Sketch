import React from 'react';
import { browserHistory } from 'react-router';

import BaseComponent from './BaseComponent.jsx';
import PlayerHeader from './PlayerHeader.jsx';
import {
  Container,
  Header,
  Segment,
  Button,
} from 'semantic-ui-react';


export default class NoRooms extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onClickHost(event) {
    browserHistory.push('/host/create');
  }

  render() {
    const {
      player
    } = this.props;

    return (
      <Segment.Group>
        <Segment>
          <PlayerHeader text="Rooms" player={player} />
        </Segment>
        <Segment>
          <Header as='h3'>
            {this._pickRandom([
              'Someone host!',
              'Dang it!',
              'Host\'s gotta host',
              'Crickets...',
              'Whew.',
            ])}
          </Header>
          <p>No rooms found. Someone has to create one!</p>
          <Button onClick={this.onClickHost}>Host a Room</Button>
        </Segment>
      </Segment.Group>
    );
  }

  // Attribution: Pick a random element from a list
  // Url: https://jsfiddle.net/katowulf/3gtDf/
  // Accessed: March 7, 2017
  _pickRandom(list) {
    const i = Math.floor(Math.random() * list.length);
    return list[i];
  }
}

NoRooms.propTypes = {
  player: React.PropTypes.object,
};
