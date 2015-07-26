angular.module('blockchess.game.suggestedMoves.favoriteCount', [])
.filter('favoriteCount', favoriteCount);

function favoriteCount() {
  return function(move) {
    return getFavoriteCountFrom(move);
  };
}

function getFavoriteCountFrom(move) {
  var count = 0;
  move.evaluations.forEach(function(evl) {
    if (evl.favorite_move)
      count += 1;
  });
  return count;
}