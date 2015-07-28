angular.module('blockchess.game.suggestedMoves.move', [
  // Directives
  'blockchess.game.suggestedMoves.move.myRating',
  // Filters
  'blockchess.game.suggestedMoves.move.favoriteCount',
  'blockchess.game.suggestedMoves.move.avgStars'
])
.directive('suggestedMove', suggestedMove);

function suggestedMove() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/suggested_moves/move/suggested_move.ng.html",
    controller: suggestedMoveController,
    restrict: 'A',
    scope: { move: '=' }
  };
}

function suggestedMoveController($meteor) {
  var ctrl = this;
  angular.extend(ctrl, {
    evaluations: []
  });

  init()

  function init() {
    getEvaluations();
  }

  function getEvaluations() {
    $meteor.subscribe('evaluations').then(function() {
      ctrl.evaluations = $meteor.collection(Evaluations, { moveId: ctrl.move._id });
    });
  }
}