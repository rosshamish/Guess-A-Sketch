import React from 'react';

import BaseComponent from './BaseComponent.jsx';
import {
  Label,
  Header,
} from 'semantic-ui-react';


export default class PlayerHeader extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      text,
      player,
      size,
    } = this.props;

    const defaultSize = 'large';

    return (
      <Header size={size || defaultSize}>
        {text}
        { player ?
          <Label
            circular
            size={size || defaultSize}
            color={player.color}
            content={player.name} />
          :
          null
        }
      </Header>
    );
  }
}

PlayerHeader.propTypes = {
  text: React.PropTypes.string,
  player: React.PropTypes.object,
  size: React.PropTypes.string,
};
