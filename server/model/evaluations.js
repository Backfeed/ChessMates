Meteor.publish('evaluations', publish);

Evaluations.before.insert(beforeInsert);
Evaluations.after.insert(afterInsert);

Meteor.methods({
  rate: create
});


/********* Publish and hooks *********/
function publish(options) {
  return Evaluations.find({});
}

function afterInsert(uid, evl) {
  Meteor.call("protoRate", uid, evl.moveId, evl.stars);
}

function beforeInsert(uid, evl) {
  validateUniqueness(uid, evl);
  makeFormerEvalsInactive(uid, evl);
}

/********* Helper methods *********/
function validateUniqueness(uid, evl) {
  if (!isUniq(evl.moveId, evl.stars))
    throw new Meteor.Error(400, "Your last evaluation is also " + evl.stars);
}

function isUniq(moveId, stars) {
  return !Evaluations.findOne({
    moveId: moveId,
    uid: Meteor.userId(),
    stars: stars,
    inactive: false
  });
}

function makeFormerEvalsInactive(uid, evl) {
  Evaluations.update(
    { 
      uid: uid, 
      moveId: evl.moveId
    },
    { $set: { inactive: true } },
    { multi: true }
  );
}

function create(moveId, stars) {
  Evaluations.insert({
    moveId: moveId,
    uid: Meteor.userId(),
    reputation: Meteor.user().reputation,
    inactive: false,
    stars: stars
  });
}