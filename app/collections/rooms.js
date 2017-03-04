/**
 * Created by anjueappen on 3/3/17.
 */

Rooms = new Mongo.Collection('hello');

Rooms.allow({
  insert() { return false; },
  update() { return false; },
  remove() { return false; },
});

Rooms.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
