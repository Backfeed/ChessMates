Meteor.publish('evaluations', function (options, gameId) {
  return Evaluations.find({}, { fields: { stars: 1, moveId: 1, userId: 1 } });
});

Evaluations.after.insert(afterInsert);
Evaluations.after.update(afterUpdate);

Meteor.methods({
  rate: rate
});

function rate(moveId, stars) { 
  findOrCrate(moveId, stars); 
}

function findOrCrate(moveId, stars) {
  var myEvaluation = getBy(moveId);
  if (myEvaluation)
    update(moveId, stars);
  else
    create(moveId, stars);
}

function getBy(moveId) {
  return Evaluations.findOne({ moveId: moveId, userId: Meteor.userId() });
}

//TODO why do you update this? only updating the stars is needed
function update(moveId, stars) {
  Evaluations.update(
    {
      moveId: moveId, 
      userId: Meteor.userId()
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

function afterInsert(userId, evl) {
  Meteor.call("protoRate", evl.moveId, evl.stars);
}

function afterUpdate(userId, evl, fieldNames, modifier, options) {
  if (fieldNames.length === 1 && fieldNames[0] === 'stars' )
    Meteor.call("protoRate", evl.moveId, evl.stars);
}