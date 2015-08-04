Meteor.publish('evaluations', function (options) {
  return Evaluations.find({});
});

Evaluations.after.insert(afterInsert);
Evaluations.after.update(afterUpdate);

Meteor.methods({
  rate: rate
});

function rate(moveId, stars) { 
  updateOrCreate(moveId, stars); 
}

function updateOrCreate(moveId, stars) {
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
    { $set: { 
        stars: stars, 
        reputation: Meteor.user().reputation
      } 
    }
  )
}

function create(moveId, stars) {
  Evaluations.insert({
    moveId: moveId,
    userId: Meteor.userId(),
    reputation: Meteor.user().reputation,
    stars: stars
  });
}

function afterInsert(userId, evl) {
  Meteor.call("protoRate", userId, evl.moveId, evl.stars);
}

function afterUpdate(userId, evl, fieldNames, modifier, options) {
  if (fieldNames.length === 2 && fieldNames[0] === 'stars', fieldNames[1] === 'reputation' )
    Meteor.call("protoRate", userId, evl.moveId, evl.stars);
}