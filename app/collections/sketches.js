/**
 * Created by anjueappen on 3/4/17.
 */
import {Players} from 'players';

export Sketches = new Mongo.Collection('sketches');
Sketches.schema = new SimpleSchema({
  sketchID: { type: String, regEx: SimpleSchema.RegEx.Id },
  playerID: { type: Players.schema},
});
