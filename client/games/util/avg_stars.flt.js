angular.module('game.util.avgStars', [])
.filter('avgStars', avgStars);

function avgStars() {
  return function(move) {
    return getAvgFrom(move);
  };
}

function getAvgFrom(move) {
  var evalCount = 0;
  var starsSum = 0;
  var stars;
  move.evaluations.forEach(function(evalArr, i) {
    stars = i+1;
    evalCount += evalArr.length;
    starsSum += evalArr.length * stars;
  });
  return starsSum / evalCount;
}