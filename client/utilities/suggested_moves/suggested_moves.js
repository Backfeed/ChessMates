angular.module('blockchess.utilities.suggestedMoves', [])
.directive('suggestedMoves', suggestedMoves)

function suggestedMoves() {
  return {
    templateUrl: "client/utilities/suggested_moves/suggested_moves.ng.html",
    controller: suggestedMovesController,
    scope: { suggestedMoves: '=' }
  }
}

function suggestedMovesController($scope) {

}