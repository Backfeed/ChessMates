angular.module('blockchess.game.suggestedMoves', [
  // Services
  'blockchess.game.suggestedMoves.evaluations',
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
    scope: { selectedMove: '=', suggestedMoves: '=', activeReputationSum: '=' }
  };
}

function suggestedMovesController($meteor) {
  var ctrl = this;
  angular.extend(ctrl, {
    unhighlight: unhighlight,
    highlight: highlight
  });

  function highlight(move) { ctrl.selectedMove = move; }
  function unhighlight()   { ctrl.selectedMove = {};   }

}