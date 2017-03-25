import { configure } from '@kadira/storybook';

const req = require.context('../tests/ui/stories', true, /.jsx?$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
