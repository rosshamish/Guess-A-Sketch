import '/imports/startup/server';

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    Rooms.remove({});
});

Meteor.methods({
    insertRoom( id, name ) {
        Rooms.insert( { id: id, name: name } );
    }
});


