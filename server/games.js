Meteor.publish('games', function (options, gameId) {
  return Games.find({});
});

engineMoveStream.permissions.write(function() { return true; });
engineMoveStream.permissions.read(function()  { return true; });

engineEvalStream.permissions.write(function() { return true; });
engineEvalStream.permissions.read(function()  { return true; });

whosTurnStream.permissions.write(function()   { return true; });
whosTurnStream.permissions.read(function()    { return true; });

timerStream.permissions.write(function()      { return true; });
timerStream.permissions.read(function()       { return true; });