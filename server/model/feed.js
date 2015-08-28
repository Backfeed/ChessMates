Meteor.publish('feeds', publish);

Feeds.before.insert(beforeInsert);

Meteor.methods({
  destroyFeeds: destroyList,
  log: create
})

var log = _DEV.log('MODEL: FEEDS:');


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

function destroyList(gameId) {
  Feeds.remove({ gameId: gameId });
}


/********* Publish and hooks *********/
function publish(gameId) {
  return Feeds.find({ gameId: gameId });
}

function beforeInsert(uid, item) {
  if (item.type === 'comment')
    validateUser(uid);
}

function validateUser(uid) {
  if (! uid)
    throw new Meteor.Error(200, 'Must be logged in to comment')
}