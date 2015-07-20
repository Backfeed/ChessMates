angular.module('game.util.avgStars', [])
.filter('avgStars', avgStars);

function avgStars() {
  return function(move) {
    return getAvgFrom(move);
  };
}

function getAvgFrom(move) {
  var starsSum = 0;
  move.evaluations.forEach(function(evl) {
    starsSum += evl.stars;
  });
  return starsSum / move.evaluations.length;
}