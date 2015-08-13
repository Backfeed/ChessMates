Meteor.publish('comments', publish);

Meteor.methods({
  createComment: create
})


/********* Helper methods *********/
function create(gameId, turnIndex, text) {
  Comments.insert({
    gameId: gameId,
    uid: Meteor.userId(),
    createdAt: Date.now(),
    turnIndex: turnIndex,
    text: text
  });
}


/********* Publish and hooks *********/
function publish(gameId, turnIndex) {
  return Comments.find({});
}