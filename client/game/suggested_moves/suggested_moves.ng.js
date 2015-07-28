angular.module('blockchess.game.suggestedMoves', [
  'blockchess.game.suggestedMoves.evaluationModel',
  'blockchess.game.suggestedMoves.favoriteCount',
  'blockchess.game.suggestedMoves.protocol',
  'blockchess.game.suggestedMoves.avgStars'
])
.directive('suggestedMoves', suggestedMoves);

function suggestedMoves() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/suggested_moves/suggested_moves.ng.html",
    controller: suggestedMovesController,
    restrict: 'E',
    scope: { gameId: '=', selectedMove: '=' }
  };
}

function suggestedMovesController($meteor) {
  var ctrl = this;
  angular.extend(ctrl, {
    toggle: toggle,
    suggestedMoves: {}
  });

  init();

  function init() {
    ctrl.suggestedMoves = $meteor.collection(SuggestedMoves, { gameId: ctrl.gameId }).subscribe('suggestedMoves');
  }

  function toggle(move) {
    if (ctrl.selectedMove === move)
      ctrl.selectedMove = {};
    else
      ctrl.selectedMove = move;
  }

}