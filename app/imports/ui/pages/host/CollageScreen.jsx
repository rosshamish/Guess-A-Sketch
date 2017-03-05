import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';

import Canvas from '../../components/Collage.jsx';

export default class CollageScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      round,
    } = this.props;

    return (
      <p>Will display a collage of all drawings from the previous round!</p>
    );
  }
}

CollageScreen.propTypes = {
  round: React.PropTypes.object,
};
