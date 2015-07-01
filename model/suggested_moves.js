SuggestedMoves = new Mongo.Collection("suggested_moves");

SuggestedMoves.allow({
  insert: function (userId, suggested_move) {
    return userId && movesDontContainFen(suggested_move.game_id, suggested_move.fen);
  }
});

var movesDontContainFen = function (game_id, fen) {
  return SuggestedMoves.find({ 'fen': fen, 'game_id': game_id }).count() == 0;//!_.contains(fens, fen);
};

Meteor.methods({



})
