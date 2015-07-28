Meteor.publish('evaluations', function (options, gameId) {
  return Evaluations.find({"gameId": "1"});
});

Meteor.methods({
  rate: rate
});

function rate(moveId, stars) {
  var myEvaluation = getBy(moveId);
  if (myEvaluation)
    updateBy(moveId, stars);
  else
    createBy(moveId, stars);
}

function getBy(moveId) {
  return Evaluations.findOne({ moveId: moveId, userId: Meteor.userId() });
}

function updateBy(moveId, stars) {
  Evaluations.update(
    { 
      moveId: moveId, userId: 
      Meteor.userId() 
    },
    { $set: { stars: stars } }
  )
}

function createBy(moveId, stars) {
  Evaluations.insert({ 
    moveId: moveId, 
    userId: Meteor.userId(),
    favoriteMove: false,
    stars: stars
  });
}