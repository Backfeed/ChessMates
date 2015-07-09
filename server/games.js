Meteor.publish('games', function (options, gameId) {
  return Games.find({});
});
//Games.helpers({
//  game:  function() { return Games.findOne({ 'game_id': this.game_id }); }
//});

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
