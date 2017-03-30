import React from 'react';
import { _ } from 'underscore';
import BaseComponent from './BaseComponent.jsx';
import { Table } from 'semantic-ui-react';
import SketchRating from '/imports/ui/components/SketchRating.jsx';

import { getStarRating } from '/imports/scoring';


export default class ScoringTuning extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { } = this.props;

    const ranks = [];
    for (var i=9; i >= 0; i--) {
      ranks.push(i);
    }
    const confidences = [];
    for (var i=0.00; i <= 1.00; i += 0.1) {
      confidences.push(Math.round(i * 100) / 100);
    }
    const renderRows = [];
    _.each(confidences, (confidence) => {
      const ratings = _.map(ranks, (rank) => (
        <Table.Cell>
          <SketchRating size="tiny" rating={getStarRating(rank, confidence)} />
        </Table.Cell>
      ));
      renderRows.push(
        <Table.Row>
          <Table.Cell>{confidence}</Table.Cell>
          {ratings}
        </Table.Row>,
      );
    });
    const renderRankHeaders = _.map(ranks, (rank) => (
      <Table.HeaderCell>{rank}</Table.HeaderCell>
    ));

    return (
      <Table stackable={false}>
        <Table.Header>
          <Table.HeaderCell></Table.HeaderCell>
          {renderRankHeaders}
        </Table.Header>
        <Table.Body>
          {renderRows}
        </Table.Body>
      </Table>
    );
  }
}

ScoringTuning.propTypes = {
};
