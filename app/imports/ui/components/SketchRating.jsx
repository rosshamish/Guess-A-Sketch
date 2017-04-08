import React from 'react';
import { _ } from 'underscore';
import BaseComponent from './BaseComponent.jsx';
import { Rating } from 'semantic-ui-react';

export default class SketchRating extends BaseComponent {
  render() {
    let rating = this.props.rating;
    if (rating === 0) {
      rating = 1;
    }

    return (
      <Rating
        icon="star"
        size={this.props.size || "massive"}
        disabled
        maxRating={5}
        rating={this.props.rating}
      />
    );
  }
}

SketchRating.propTypes = {
  rating: React.PropTypes.number,
};
