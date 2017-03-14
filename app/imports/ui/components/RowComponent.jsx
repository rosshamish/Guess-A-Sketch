import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class RowComponent extends BaseComponent {
    constructor(props) {
        super(props);
    }

  render() {
    const {
      row,
    } = this.props;

    return (
      <tr><th>{row.rank}</th><th>{row.name}</th><th>{row.score}</th></tr>
    );
  }
}

RowComponent.propTypes = {
  row: React.PropTypes.object,
};
