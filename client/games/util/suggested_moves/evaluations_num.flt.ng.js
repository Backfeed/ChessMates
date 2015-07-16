angular.module('blockchess.games.util.suggestedMoves.evaluationsNum', [])
.filter('evaluationsNum', evaluationsNum);

function evaluationsNum() {
  return function(move) {
    return getEvalCountFrom(move);
  };
}

function getEvalCountFrom(move) {
  var count = 0;
  move.evaluations.forEach(function(evalArr, i) {
    count += evalArr.length;
  });
  return count;
}