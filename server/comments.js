Meteor.publish("comments", function (options, move_id) {
  return Comments.find({ 'suggested_move_id': move_id }, options);
});
