import { Meteor } from 'meteor/meteor';
import { chai, expect, assert } from 'meteor/practicalmeteor:chai';
import { _ } from 'underscore';

import StubCollections from 'meteor/hwillson:stub-collections';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Rooms } from './collections/rooms';
import { Sketches } from './collections/sketches';
import { rooms, sketches } from '/tests/ui/stories/constants';

import { currentRound} from '../game-status';

//
// Meteor Methods under test
//
import {
  submitSketch,
} from './methods';

describe('submitting a sketch', function () {
  beforeEach(function () {
    resetDatabase();
    StubCollections.stub(Rooms);
    StubCollections.stub(Sketches);
  });

  it('should be scored and inserted into Rooms, Sketches', function () {
    const room = _.find(rooms, (room) => room.status === 'PLAYING');
    if (!room) {
      assert(false, 'No room to submit sketches to');
    }
    Rooms.insert(room);

    const sketch = _.find(sketches, (s) => (
      // TODO normalize players out of room and sketch
      _.contains(room.players, s.player)
    ));
    const round = currentRound(room);

    const afterSubmitSketch = new Promise((resolve, reject) => {
      const result = submitSketch.call(sketch, round, 
        function(error, result) {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
      if (!result) {
        reject(result);
      }
    });
    return afterSubmitSketch.then(function (sketchID) {
      let sketch = Sketches.find(sketchID);
      expect(sketch).to.not.be.undefined;
      expect(sketch.scores).to.be.an('array');
      expect(sketch.scores).to.not.be.empty;
      // TODO expect sketchID to be found in room.rounds[x].sketches
    });
  });

});