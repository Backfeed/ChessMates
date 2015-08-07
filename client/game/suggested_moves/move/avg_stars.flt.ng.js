angular.module('blockchess.game.suggestedMoves.move.avgStars', [])
.filter('avgStars', avgStars);

function avgStars($meteor) { 
  return function(evaluations) {
    return compose(decimel(1), average, map(property('stars')))(evaluations);
  };
}