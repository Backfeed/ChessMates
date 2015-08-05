Meteor.publish('favoriteMoves', publish);

Meteor.methods({
  favor: favor
});

function publish(options, moveId) {
  // TODO :: Make Count work
  // console.log(moveId);
  // console.log(FavoriteMoves.find({ "moveId": moveId }).count());
  Counts.publish(this, 'favoriteMovesCount', FavoriteMoves.find({ "moveId": moveId }), { noReady: true });
  return FavoriteMoves.find({ "moveId": moveId });
}

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