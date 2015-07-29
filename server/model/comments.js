Meteor.publish('comments', function (options, gameId) {
  return Comments.find({"gameId": "1"});
});

