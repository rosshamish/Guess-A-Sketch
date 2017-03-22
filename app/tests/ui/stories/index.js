import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import WelcomePage from '/imports/ui/pages/WelcomePage.jsx';

storiesOf('Welcome', module)
  .add('homepage', () => (
    <WelcomePage />
  ));
