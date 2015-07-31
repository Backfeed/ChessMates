Meteor.publish('evaluations', function (options, gameId) {
  return Evaluations.find({}, { fields: { stars: 1, moveId: 1, userId: 1, favoriteMove: 1 } });
});

Meteor.methods({
  rate: rate
});

function rate(moveId, stars) {
  var myEvaluation = getBy(moveId);
  if (myEvaluation)
    update(moveId, stars);
  else
    create(moveId, stars);
  Meteor.call("protoRate", moveId, stars);
}

function getBy(moveId) {
  return Evaluations.findOne({ moveId: moveId, userId: Meteor.userId() });
}

  //TODO why do you update this? only updating the stars is needed
function update(moveId, stars) {
  Evaluations.update(
    {
      moveId: moveId, userId:
      Meteor.userId()
    },
    { $set: { stars: stars } }
  )
}

function create(moveId, stars) {
  Evaluations.insert({
    moveId: moveId,
    userId: Meteor.userId(),
    stars: stars
  });
}

function amICreatorOfMove(id) {
  return SuggestedMoves.findOne({ _id: id }).userId === Meteor.userId();
}

function isFavoriteMove(moveId) {
  var evl = getBy(moveId);
  if (!evl) return false;
  return evl.favoriteMove;
}

function flagMove(moveId, flag) {
  if (flag && getFavoriteMove())
    unflagMove();

  Evaluations.update(
    {
      moveId: moveId,
      userId: Meteor.userId()
    },
    { $set: { favoriteMove: flag } }
  )
}

function getFavoriteMove(userId) {
  // SuggestedMoves.find({  })
  // Evaluations.find({
  //   userId: userId || Meteor.userId(),
  //   moveId
  //   favoriteMove:
  // })
}

function unflagMove() {

}