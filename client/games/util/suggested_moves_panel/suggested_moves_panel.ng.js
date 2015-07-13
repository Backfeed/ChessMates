angular.module('blockchess.games.util.suggestedMovesPanel', [])
.directive('suggestedMovesPanel', suggestedMovesPanel);

function suggestedMovesPanel() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/games/util/suggested_moves_panel/suggested_moves_panel.ng.html",
    controller: suggestedMovesPanelController,
    scope: { moves: '=' ,  selectedMove: '=' }
  }
}

function suggestedMovesPanelController($scope, CommonService, EvaluationModel) {
  var ctrl = this;
  
  angular.extend(ctrl, {
    flagFavorite: flagFavorite,
    hoveringOver: hoveringOver,
    evaluate: evaluate,
    isFavorite: false,
    stars: 0
  });

  $scope.$watch('ctrl.selectedMove', selectedMoveChanged);

  function selectedMoveChanged(move) {
    if (!move || !move.evaluations) { return; }
    var myEvaluation = EvaluationModel.getEvaluationByUser(move);
    if (myEvaluation) {
      ctrl.stars = myEvaluation.stars;
      ctrl.isFavorite = myEvaluation.favorite_move;
    } else {
      ctrl.stars = 0;
      ctrl.isFavorite = false;
    }
  }

  function flagFavorite() {
    if (!ctrl.stars) { 
      CommonService.toast('Please rate the move before favoriting it'); 
      ctrl.isFavorite = false;
      return;
    }
    EvaluationModel.flagFavorite(ctrl.selectedMove, ctrl.isFavorite);
  }

  function evaluate() {
    EvaluationModel.evaluate(ctrl.selectedMove, ctrl.stars);
  }

  function hoveringOver(value) {
    //TODO add tooltip from spec
  }

}