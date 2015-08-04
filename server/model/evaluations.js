Meteor.publish('evaluations', function (options) {
  return Evaluations.find({});
});

Evaluations.after.insert(afterInsert);

Meteor.methods({
  rate: create
});

function getBy(moveId) {
  return Evaluations.findOne({ moveId: moveId, userId: Meteor.userId() });
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