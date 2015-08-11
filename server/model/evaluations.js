Meteor.publish('evaluations', publish);
Evaluations.after.insert(afterInsert);

Meteor.methods({
  rate: create
});

function create(moveId, stars) {
  Evaluations.insert({
    moveId: moveId,
    userId: Meteor.userId(),
    reputation: Meteor.user().reputation,
    stars: stars
  });
}


/********* Helper methods *********/
function getBy(moveId) {
  return Evaluations.findOne({ moveId: moveId, userId: Meteor.userId() });
}


/********* Publish and hooks *********/
function publish(options) {
  return Evaluations.find({});
}

function afterInsert(userId, evl) {
  Meteor.call("protoRate", userId, evl.moveId, evl.stars);
}