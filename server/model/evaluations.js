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
  logEval(uid, evl);
}

function logEval(uid, evl) {
  var text = User.displayNameOf(uid) + " rates " + evl.notation + " " + evl.stars + " stars";
  if (evl.stars === 5)
    text += '!!';
  Meteor.call('log', evl.gameId, evl.turnIndex, text, 'evaluation');
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
    active: true
  });
}

function makeFormerEvalsInactive(uid, evl) {
  Evaluations.update(
    { 
      uid: uid, 
      moveId: evl.moveId
    },
    { $set: { active: false } },
    { multi: true }
  );
}

function create(gameId, moveId, turnIndex, notation, stars) {
  Evaluations.insert({
    gameId: gameId,
    turnIndex: turnIndex,
    moveId: moveId,
    notation: notation,
    uid: Meteor.userId(),
    reputation: Meteor.user().reputation,
    active: true,
    stars: stars
  });
}