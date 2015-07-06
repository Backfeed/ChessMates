angular.module('blockchess.utilities.suggestedMovesPanel', [])
.directive('suggestedMovesPanel', suggestedMovesPanel)

function suggestedMovesPanel() {
  return {
    templateUrl: "client/utilities/suggested_moves_panel/suggested_moves_panel.ng.html",
    controller: suggestedMovesPanelController,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: { moves: '=' ,  selectedMove: '=' }
  }
}

function suggestedMovesPanelController() {
  var ctrl = this;
  angular.extend(ctrl, {
    evaluateMove   : evaluateMove,
    rating         : 0,
    hoveringOver   : hoveringOver
  });

  function evaluateMove(move) {
    var evaluation = getEvaluationByUser(move);
    if (evaluation) {
      updateEvaluation(evaluation, ctrl.rating);
    } else {
      addEvaluation(move, ctrl.rating);
    }
  }

  function getEvaluationByUser(move) {
    return _.find(move.evaluations, function(item) {
      return item.user_id === Meteor.userId();
    });
  }

  function addEvaluation(move, stars) {
    move.evaluations = [];
    move.evaluations.push({
      user_id: Meteor.userId(),
      created_at: Date.now(),
      stars: stars
    });
  }

  function updateEvaluation(evaluation, stars) {
    evaluation.stars = stars;
  }

  function hoveringOver(value) {
    //TODO add tooltip from spec
  }

}