Meteor.publish("evaluations", function (options) {
  // check(gameId, String);
  return Evaluations.find({}, options);
});
