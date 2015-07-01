SuggestedMoves = new Mongo.Collection("suggested_moves");

SuggestedMoves.allow({
  insert: function (userId, suggested_move) {
    return userId && movesDontContainFen(suggested_move.game_id, suggested_move.fen);
  }
});

var movesDontContainFen = function (game_id, fen) {
  return SuggestedMoves.find({ 'fen': fen, 'game_id': game_id }).count() == 0;
};

Meteor.methods({
});

SuggestedMoves.helpers({
  game:        function() { return Games.findOne({ '_id': this.game_id });              },
  user:        function() { return Meteor.users.findOne({ '_id': this.user_id });       },
  evaluations: function() { return Evaluations.find({ 'suggested_move_id': this._id }); }
});
