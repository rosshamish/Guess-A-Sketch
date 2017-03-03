// Purpose: be able to import client startup (in client/main.js) through
// a single entry point (this module)

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from './routes.jsx';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('react-root'));
});

