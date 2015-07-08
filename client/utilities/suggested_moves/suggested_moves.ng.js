angular.module('blockchess.utilities.suggestedMoves', [])
.directive('suggestedMoves', suggestedMoves)

function suggestedMoves() {
  return {
    templateUrl: "client/utilities/suggested_moves/suggested_moves.ng.html",
    restrict: 'E',
    controller: suggestedMovesController,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: { moves: '=', selectedMove: '=' }
  }
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