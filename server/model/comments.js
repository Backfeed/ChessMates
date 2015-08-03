Meteor.publish('comments', function (options, moveId, gameId) {
  return Comments.find({moveId: moveId});
});