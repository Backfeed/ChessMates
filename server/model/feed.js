Meteor.publish('feeds', publish);

Feeds.before.insert(beforeInsert);

Meteor.methods({
  log: log
})


/********* Helper methods *********/
function log(gameId, turnIndex, text, type) {
  Feeds.insert({
    gameId: gameId,
    uid: Meteor.userId(),
    createdAt: Date.now(),
    turnIndex: turnIndex,
    type: type,
    text: text
  });
}


/********* Publish and hooks *********/
function publish() {
  return Feeds.find();
}

function beforeInsert(uid, item) {
  if (item.type === 'comment')
    validateUser(uid);
}

function validateUser(uid) {
  if (! uid)
    throw new Meteor.Error(200, 'Must be logged in to comment')
}