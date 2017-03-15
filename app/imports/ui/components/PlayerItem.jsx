import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class PlayerItem extends BaseComponent {
    constructor(props) {
        super(props);
    }

  render() {
    const {
      player,
    } = this.props;

    const style = {
      color: player.color,
    };

    return ( // key suppresses a key error in console
      <p style={style} key={player}>{player.name}</p> 
    );
  }
}

PlayerItem.propTypes = {
  player: React.PropTypes.object,
};
