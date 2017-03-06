/**
 * Created by anjueappen on 3/4/17.
 */
import { Mongo } from 'meteor/mongo';
import { Schema } from '../schema';

export const Rounds = new Mongo.Collection('rounds');
Rounds.attachSchema(Schema.Round);


