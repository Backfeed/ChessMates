Meteor.publish('favoriteMoves', function (options, gameId) {
  return FavoriteMoves.find({});
});

Meteor.methods({
  createFavoriteMove: create,
  destroyFavoriteMove: destroy,
  isFavorite: isFavorite
});

function create(gameId, turnIndex, moveId) {
  FavoriteMoves.insert({
    gameId: gameId,
    moveId: moveId,
    userId: Meteor.userId(),
    turnIndex: turnIndex
  });
}

function destroy(moveId) {
  FavoriteMoves.remove({ moveId: moveId, userId: Meteor.userId() });
}

function isFavorite(moveId) {
  return !!FavoriteMoves.findOne({ moveId: moveId, userId: Meteor.userId() });
}