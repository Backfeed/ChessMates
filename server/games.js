Meteor.publish('games', function (options, gameId) {
  return Games.find({});
});
// Meteor.publish("userStatus", function() {
//   return Meteor.users.find({ "status.online": true });
// });

timerStream.permissions.write(function() {
  return true;
});

timerStream.permissions.read(function() {
  return true;
});

whosTurnStream.permissions.write(function() {
  return true;
});

whosTurnStream.permissions.read(function() {
  return true;
});