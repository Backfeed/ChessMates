Meteor.publish('suggestedMoves', function (options, gameId) {
  return SuggestedMoves.find({"gameId": "1"});
});

// SuggestedMoves.after.insert(function(userId, doc) {
//   Meteor.call('createFavoriteMove', doc.gameId, doc.turnIndex, doc._id);
// });1