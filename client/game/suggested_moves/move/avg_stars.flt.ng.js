angular.module('blockchess.game.suggestedMoves.move.avgStars', [])
.filter('avgStars', avgStars);

function avgStars($meteor) { 
  return function(evaluations) {
    if (!evaluations || !evaluations.length) return 0;
    var starsSum = 0;
    _.each(evaluations, function(evl) {
      starsSum += evl.stars;
    });
    return starsSum / evaluations.length;
  }
}