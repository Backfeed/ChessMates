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
    $scope.rating = this.rating;
    var evaluation = getEvaluationByUser(move);
    if (evaluation)
    {
      updateEvaluation(evaluation, this.rating);
    } else {
      addEvaluation(move, this.rating);
    }
  }

  function getEvaluationByUser(move)
  {
    return _.find(move.evaluations, function(item)
    {
      return item.user_id === Meteor.userId()
    });
  }

  function addEvaluation(move, stars) {
    move.evaluations.push({
      user_id: Meteor.userId(),
      created_at: Date.now(),
      stars: stars
    });
  }

  function updateEvaluation(evaluation, stars) {
    evaluation.stars = stars;
  }

  function hoveringOver (value) {
    //TODO add tooltip from spec
  }
}
