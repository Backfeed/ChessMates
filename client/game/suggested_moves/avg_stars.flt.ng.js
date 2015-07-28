angular.module('blockchess.game.suggestedMoves.avgStars', [])
.filter('avgStars', avgStars);

function avgStars($meteor) { 
  return function(moveId) {
    var starsSum = 0;
    var evaluations = $meteor.collection(Evaluations, { suggestedMoveId: moveId });
    _.each(evaluations, function(evl) {
      starsSum += evl.stars;
    });
    return starsSum / evaluations.length;
  }
}