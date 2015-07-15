Meteor.publish('games', function (options, gameId) {
  return Games.find({});
});

movesStream.permissions.write(function() { return true; });
movesStream.permissions.read(function()  { return true; });

timerStream.permissions.write(function() { return true; });
timerStream.permissions.read(function()  { return true; });