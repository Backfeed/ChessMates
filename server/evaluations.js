Meteor.publish("evaluations", function (options, move_id) {
  check(move_id, String);
  return Evaluations.find({ suggested_move_id: move_id }, options);
});
