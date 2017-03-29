import React from 'react';
import { storiesOf } from '@kadira/storybook';

import ScoringTuning from '/imports/ui/components/ScoringTuning.jsx';

storiesOf('Scoring', module)
  .add('stars = fn(rank, confidence)', () => (
    <ScoringTuning />
  ));
