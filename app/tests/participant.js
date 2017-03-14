// Attribution: boilerplate file
// Source: Meteor Guide
// License: MIT
// URL: https://guide.meteor.com/testing.html#acceptance-testing

// These are Chimp globals
/* globals browser assert server */

function countLists() {
  // browser.waitForExist('.list-todo');
  // const elements = browser.elements('.list-todo');
  // return elements.value.length;
};

describe('participant ui', function () {
  beforeEach(function () {
    browser.url('http://localhost:3000');
    // server.call('generateFixtures');
  });

  it('lets user get a name and color @watch', function () {
    // const initialCount = countLists();

    // assert.equal(countLists(), initialCount + 1);
  });
});
