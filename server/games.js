Meteor.publish('games', function (options, gameId) {
  return Games.find({ game_id: gameId}, options);
});
Games.helpers({
  game:  function() { return Games.findOne({ 'game_id': this.game_id }); }
});
