import React from 'react';
import { _ } from 'underscore';
import BaseComponent from './BaseComponent.jsx';
import { Rating } from 'semantic-ui-react';

export default class SketchRating extends BaseComponent {
  render() {
    return (
      <Rating
        icon="star"
        size={this.props.size || "massive"}
        disabled
        maxRating={5}
        rating={this.props.rating} />
    );
  }
}

SketchRating.propTypes = {
  rating: React.PropTypes.number,
};
