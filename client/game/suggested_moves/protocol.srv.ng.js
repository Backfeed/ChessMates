angular.module('blockchess.game.suggestedMoves.protocol', [])
.service('ProtocolService', ProtocolService);

function ProtocolService($mdToast) {
    
  return {
    distributeReputation: distributeReputation
  }

  function distributeReputation(gameId, move, stars) {
    var starSpecificEvaluations = [];
    move.evaluations.forEach(function(evl) {
      if (evl.stars === stars)
        starSpecificEvaluations.push(evl);
    });
    Meteor.call("protoEvluate", gameId, move.notation, starSpecificEvaluations);
  }

}