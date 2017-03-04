/**
 * Created by anjueappen on 3/4/17.
 */

export Players = new Mongo.Collection('players');
Players.schema = new SimpleSchema({
  playerID: { type: String, regEx: SimpleSchema.RegEx.Id },
  name: { type: String },
  color: { type: String, optional: true },
});
