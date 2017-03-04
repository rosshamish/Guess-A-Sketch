// error? run 'meteor add session'
Session.setDefault('counter', 0);

Template.clicker.helpers({
  counter() {
    return Session.get('counter');
  },
  rooms() {
    console.log(Rooms.find())
    return Rooms.find();
  },
});

Template.clicker.events({
  'submit form': function (event) {
    event.preventDefault();
    const room_name = event.target.roomName.value;
    const num_rounds = event.target.numRounds.value;

    const count = Session.get('counter') + 1; // TODO: refactor ID generation to server side, not using counter

    Session.set('counter', count);

    Meteor.call('insertRoom', count, room_name, num_rounds,
        (error) => {
          if (error) {
            console.log(error);
          }
        });
  },
});
