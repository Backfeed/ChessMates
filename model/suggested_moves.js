SuggestedMoves = new Mongo.Collection("suggested_moves");

SuggestedMoves.allow({
  insert: function (userId, suggested_move) {
    return userId && movesDontContainFen('1', suggested_move.fen);
  }
});

var movesDontContainFen = function (gameId, fen) {
  return SuggestedMoves.find({ 'fen': fen }).count() == 0;//!_.contains(fens, fen);
};

Meteor.methods({



})
