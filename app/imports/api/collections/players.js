/**
 * Created by anjueappen on 3/4/17.
 */
import { Mongo } from  'meteor/mongo';
import {Schemas} from '../schemas'

Players = new Mongo.Collection('players');
Players.attachSchema(Schemas.Players)