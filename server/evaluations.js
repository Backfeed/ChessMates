Meteor.publish("evaluations", function (options, move_id) {
  // check(gameId, String);
  return Evaluations.find({ 'suggested_move_id': move_id }, options);
});
