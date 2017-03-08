/**
 * Created by anjueappen on 3/4/17.
 */
import { Mongo } from  'meteor/mongo';
import { Schema } from '../schema';

export const Sketches = new Mongo.Collection('sketches');
Sketches.attachSchema(Schema.Sketch);
