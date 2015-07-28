angular.module('blockchess.game.suggestedMoves.favoriteCount', [])
.filter('favoriteCount', favoriteCount);

function favoriteCount($meteor) {
  return function(moveId) {
    var count = 0;
    var evaluations = $meteor.collection(Evaluations, { suggestedMoveId: moveId });
    _.each(evaluations, function(evl) {
      if (evl.favoriteMove)
        count += 1;
    });
    return count;
  };
}