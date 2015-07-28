angular.module('blockchess.game.suggestedMoves.move.favoriteCount', [])
.filter('favoriteCount', favoriteCount);

function favoriteCount($meteor) {
  return function(evaluations) {
    if (!evaluations || !evaluations.length) return 0;
    var count = 0;
    _.each(evaluations, function(evl) {
      if (evl.favoriteMove)
        count += 1;
    });
    return count;
  };
}