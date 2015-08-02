Meteor.publish('favoriteMoves', function (options, gameId) {
  return FavoriteMoves.find({});
});

Meteor.methods({
  favor: favor
});

function create(moveId, turnIndex, gameId) {
  FavoriteMoves.insert({
    userId: Meteor.userId(),
    turnIndex: turnIndex,
    moveId: moveId,
    gameId: gameId
  });
}

function favor(moveId, turnIndex, gameId) {
  var myFavMove = FavoriteMoves.findOne({ turnIndex: turnIndex, userId: Meteor.userId() });
  if (myFavMove)
    FavoriteMoves.update({ _id: myFavMove._id }, { $set: { moveId: moveId } });
  else
    create(moveId, turnIndex, gameId);
}