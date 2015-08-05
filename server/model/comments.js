Meteor.publish('comments', publish);

function publish(options, moveId, gameId) {
  return Comments.find({ moveId: moveId });
}