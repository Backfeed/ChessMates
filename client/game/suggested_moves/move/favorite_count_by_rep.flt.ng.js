angular.module('blockchess.game.suggestedMoves.move.favoriteCountByRep', [])
.filter('favoriteCountByRep', favoriteCountByRep);

function favoriteCountByRep($meteor) {
  return function(favMoves) {
    if (!favMoves || !favMoves.length) return 0;
    var reputationArr = favMoves.map(property('userId')).map(getUserBy).map(property('reputation'));
    var total = sum(reputationArr);
    return parseInt(total);
  };
}