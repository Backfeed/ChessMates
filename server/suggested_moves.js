Meteor.publish("suggested_moves", function (options, game_id) {
  // check(game_id, String);
  return SuggestedMoves.find({ 'game_id': game_id }, options);
});
