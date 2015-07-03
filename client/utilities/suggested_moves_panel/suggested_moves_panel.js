angular.module('blockchess.utilities.suggestedMovesPanel', [])
.directive('suggestedMovesPanel', suggestedMovesPanel)

function suggestedMovesPanel() {
  return {
    templateUrl: "client/utilities/suggested_moves_panel/suggested_moves_panel.ng.html",
    controller: suggestedMovesPanelController,
    scope: { moves: '=' ,  selectedMove: '=' }
  }
}

function suggestedMovesPanelController($scope) {
  angular.extend($scope, {

  });

}
