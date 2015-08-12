Meteor.publish('evaluations', publish);
Evaluations.after.insert(afterInsert);

Meteor.methods({
  rate: create
});

function create(moveId, stars) {
  Evaluations.insert({
    moveId: moveId,
    uid: Meteor.userId(),
    reputation: Meteor.user().reputation,
    stars: stars
  });
}


/********* Helper methods *********/
function getBy(moveId) {
  return Evaluations.findOne({ moveId: moveId, uid: Meteor.userId() });
}


/********* Publish and hooks *********/
function publish(options) {
  return Evaluations.find({});
}

function afterInsert(uid, evl) {
  Meteor.call("protoRate", uid, evl.moveId, evl.stars);
}