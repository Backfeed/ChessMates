Meteor.publish('feeds', publish);

Feeds.before.insert(beforeInsert);

Meteor.methods({
  createComment: createComment
})

                
/********* Helper methods *********/
function create(gameId, turnIndex, text, type) {
  Feeds.insert({
    gameId: gameId,
    uid: Meteor.userId(),
    createdAt: Date.now(),
    turnIndex: turnIndex,
    type: type,
    text: text
  });
}

// Sugar for create with type set to 'comment'
function createComment(gameId, turnIndex, text) {
  create(gameId, turnIndex, text, 'comment')
}

/********* Publish and hooks *********/
function publish() {
  return Feeds.find();
}

function beforeInsert(uid, item) {
  validateUser(uid);
}

function validateUser(uid) {
  if (! uid)
    throw new Meteor.Error(200, 'Must be logged in to comment')
}