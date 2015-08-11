Meteor.publish('comments', publish);


/********* Helper methods *********/


/********* Publish and hooks *********/
function publish(options, moveId, gameId) {
  return Comments.find({});
}