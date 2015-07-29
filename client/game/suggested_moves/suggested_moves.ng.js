angular.module('blockchess.game.suggestedMoves', [
  // Directives
  'blockchess.game.suggestedMoves.move'
])
.directive('suggestedMoves', suggestedMoves);

function suggestedMoves() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/suggested_moves/suggested_moves.ng.html",
    controller: suggestedMovesController,
    restrict: 'E',
    scope: { gameId: '=', selectedMove: '=', suggestedMoves: '=' }
  };
}

function suggestedMovesController() {
  var ctrl = this;
  angular.extend(ctrl, {
    toggle: toggle
  });

  function toggle(move) {
    if (ctrl.selectedMove === move)
      ctrl.selectedMove = {};
    else
      ctrl.selectedMove = move;
  }

}
