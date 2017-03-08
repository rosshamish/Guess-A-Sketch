import React from 'react';
import BaseComponent from './BaseComponent.jsx';


export default class NoRooms extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
    } = this.props;

    return (
      <div className="room-list-empty">
        <h3>
          {this._pickRandom([
            'No Rooms',
            'Someone host!',
            'Dang it!',
            'Host\'s gotta host',
            'Crickets...'
          ])}
        </h3>
        <p>Go to /host/create to host a room!</p>
      </div>
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
};
