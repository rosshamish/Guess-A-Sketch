// Attribution: boilerplate file
// Source: Meteor Guide
// License: MIT
// URL: https://guide.meteor.com/testing.html#acceptance-testing

// These are Chimp globals
/* globals browser assert server */

function countLists() {
  browser.waitForExist('.list-todo');
  const elements = browser.elements('.list-todo');
  return elements.value.length;
};

describe('list ui', function () {
  beforeEach(function () {
    browser.url('http://localhost:3000');
    server.call('generateFixtures');
  });

  it('can create a list @watch', function () {
    const initialCount = countLists();

    browser.click('.js-new-list');

    assert.equal(countLists(), initialCount + 1);
  });
});