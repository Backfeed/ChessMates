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
    flagFavorite: flagFavorite,
    hoveringOver: hoveringOver,
    isFavorite: false,
    evaluate: evaluate,
    stars: 0
  });

  $scope.$watch('ctrl.selectedMove', selectedMoveChanged);

  function selectedMoveChanged(move) {
    if (!move) { return; }
    var myEvaluation = EvaluationModel.getEvaluationByUser(move);
    if (myEvaluation) {
      ctrl.stars = myEvaluation.stars;
      ctrl.isFavorite = move.notation === myEvaluation.favorite_move;
    } else {
      ctrl.stars = 0;
      ctrl.isFavorite = false;
    }
  }

  function flagFavorite() {
    if (!ctrl.stars) { return CommonService.toast('Please rate the move before choosing it as your favorite'); }
    EvaluationModel.flagFavorite(ctrl.selectedMove, ctrl.isFavorite);
  }

  function evaluate() {
    EvaluationModel.evaluate(ctrl.selectedMove, ctrl.stars);
  }

  function hoveringOver(value) {
    //TODO add tooltip from spec
  }

}
