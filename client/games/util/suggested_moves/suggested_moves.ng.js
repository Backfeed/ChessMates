angular.module('blockchess.games.util.suggestedMoves', [])
.directive('suggestedMoves', suggestedMoves)

function suggestedMoves() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/games/util/suggested_moves/suggested_moves.ng.html",
    controller: suggestedMovesController,
    restrict: 'E',
    scope: { moves: '=', selectedMove: '=' }
  };
}

function suggestedMovesController($scope) {
  var ctrl = this;
  angular.extend(ctrl, {
    toggle: toggle
  });

  function toggle(move) {
    if (ctrl.selectedMove === move) {
      ctrl.selectedMove = {};
    } else {
      ctrl.selectedMove = move;
    }
  }

}