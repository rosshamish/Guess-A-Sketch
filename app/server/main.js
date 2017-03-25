import '/imports/startup/server';
import {Rooms} from '../imports/api/collections/rooms';

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // Rooms.remove({}); // Clear all rooms from the database
});
