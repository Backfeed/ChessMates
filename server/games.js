Meteor.publish('games', function (options, gameId) {
  return Games.find({ game_id: gameId} ,options);
});
Meteor.publish('games_history', function (options) {
  return GamesHistory.find({} ,options);
});
