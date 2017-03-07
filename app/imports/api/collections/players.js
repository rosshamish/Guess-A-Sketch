/**
 * Created by anjueappen on 3/4/17.
 */
import { Mongo } from  'meteor/mongo';
import { Schema } from '../schema'

export const Players = new Mongo.Collection('players');
Players.attachSchema(Schema.Player);