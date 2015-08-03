angular.module('blockchess.game.suggestedMoves.move.avgStars', [])
.filter('avgStars', avgStars);

function avgStars($meteor) { 
  return function(evaluations) {
    if (!evaluations || !evaluations.length) return 0;
    var starsSum = _.reduce(evaluations, function(memo, evl) {
      return memo + evl.stars;
    }, 0);
    var starsAvg = starsSum / evaluations.length;
    return parseFloat(starsAvg.toFixed(1));
  }
}
