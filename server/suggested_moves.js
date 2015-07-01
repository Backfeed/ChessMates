Meteor.publish("suggested_moves", function (options) {
  // check(gameId, String);
  return SuggestedMoves.find({}, options);// 'gameId': gameId });
});
