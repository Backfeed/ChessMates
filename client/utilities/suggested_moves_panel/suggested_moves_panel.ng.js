angular.module('blockchess.utilities.suggestedMovesPanel', [])
.directive('suggestedMovesPanel', suggestedMovesPanel);

function suggestedMovesPanel() {
  return {
    templateUrl: "client/utilities/suggested_moves_panel/suggested_moves_panel.ng.html",
    controller: suggestedMovesPanelController,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: { moves: '=' ,  selectedMove: '=' }
  }
}

function suggestedMovesPanelController($scope, CommonService, EvaluationModel) {
  var ctrl = this;
  angular.extend(ctrl, {
    evaluate   : evaluate,
    stars: 0,
    hoveringOver   : hoveringOver
  });

  $scope.$watch('ctrl.selectedMove', selectedMoveChanged);

  function selectedMoveChanged(move) {
    if (!move) { return; }
    var myEvaluation = EvaluationModel.getEvaluationByUser(move);
    if (myEvaluation) {
      ctrl.stars = myEvaluation.stars;
    } else {
      ctrl.stars = 0;
    }
  }

  function evaluate() {
    EvaluationModel.evaluate(ctrl.selectedMove, ctrl.stars);
  }

  function hoveringOver(value) {
    //TODO add tooltip from spec
  }

}
