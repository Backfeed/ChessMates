Meteor.publish('evaluations', function (options) {
  return Evaluations.find({});
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
  Meteor.call("protoRate", userId, evl.moveId, evl.stars);
}

function afterUpdate(userId, evl, fieldNames, modifier, options) {
  if (fieldNames.length === 1 && fieldNames[0] === 'stars' )
    Meteor.call("protoRate", userId, evl.moveId, evl.stars);
}