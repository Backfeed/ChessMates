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
    evaluateMove   : evaluateMove,
    rating         : 3,
    hoveringOver   : hoveringOver
  });

  function evaluateMove(move) {
    //TODO first search if evaluation exists
    $scope.rating = this.rating;
    move.evaluations.push({
      user_id: Meteor.userId(),
      created_at: Date.now(),
      stars: this.rating
    });
    //TODO else update. do the same for favorite_move
  }

  function hoveringOver (value) {
    //TODO add tooltip from spec
  }
}
