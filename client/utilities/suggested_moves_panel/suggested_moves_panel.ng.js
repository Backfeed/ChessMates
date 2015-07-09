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

function suggestedMovesPanelController(EvaluationModel) {
  var ctrl = this;
  angular.extend(ctrl, {
    evaluateMove   : evaluateMove,
    stars          : 0,
    hoveringOver   : hoveringOver
  });

  function evaluateMove() {
    EvaluationModel.evaluate(move, ctrl.stars);
  }

  function hoveringOver(value) {
    //TODO add tooltip from spec
  }

}
