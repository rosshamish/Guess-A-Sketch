// error? run 'meteor add session'
Session.setDefault('counter', 0);

Template.clicker.helpers({
  counter: function () {
    return Session.get('counter');
  },
  rooms() {
    return Rooms.find();
  }
});

Template.clicker.events({
  'submit form': function (event) {
    event.preventDefault();
    var room_name = event.target.roomName.value;

    let count = Session.get('counter') + 1;

    Session.set('counter', count);

    Meteor.call('insertRoom', count, room_name, ( error ) => {
      if ( error ) {
        console.log( error );
      }
    });
  }
});
