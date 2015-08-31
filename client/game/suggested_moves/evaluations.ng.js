angular.module('blockchess.game.suggestedMoves.evaluations', [])
.service('Evaluation', Evaluation);

function Evaluation($rootScope, $meteor, Toast) {
  var $scope = $rootScope.$new();
  var service = {
    rate: rate,
    canRate: canRate,
    init: init,
    evals: {}
  };

  return service;

  function rate(gameId, moveId, turnIndex, notation, stars) {
    // Validations
    if (!Meteor.userId())
      return Toast.toast('Must be logged in to evaluate moves');
    if (!Meteor.user().reputation)
      return Toast.toast('Must have reputation to evaluate moves');

    $meteor.call('rate', gameId, moveId, turnIndex, notation, stars);
  }

  function init(gameId, turnIndex) {
    var evalsSubPromise = $scope.$meteorSubscribe('evaluationsForTurn', gameId, turnIndex);
    service.evals[gameId] = $scope.$meteorCollection(Evaluations, { gameId: gameId, turnIndex: turnIndex }, false);
  }

}

function canRate() {
   return !!Meteor.userId() && Meteor.user().reputation;
}