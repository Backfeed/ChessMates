angular.module('blockchess.game.suggestedMoves.move', [
  // Service
  // Directives
  // Filters
  'blockchess.game.suggestedMoves.move.avgStars'
])
.directive('suggestedMove', suggestedMove);

function suggestedMove() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/suggested_moves/move/suggested_move.ng.html",
    controller: suggestedMoveController,
    restrict: 'A',
    scope: { move: '=', activeReputationSum: '=' }
  };
}

function suggestedMoveController($meteor, $scope, Evaluation) {
  var ctrl = this;
  angular.extend(ctrl, {
    getDisabledRateText: getDisabledRateText,
    calcRelativeScore: calcRelativeScore,
    calcRelativeConfidence: calcRelativeConfidence,
    rate: rate,
    canRate: Evaluation.canRate,
    evaluations: [],
    myEvl: {}
  });

  $scope.$watch('ctrl.myRating', rate);

  init();

  function init() {
    $scope.$meteorSubscribe('evaluations').then(function() {
      getEvaluations();
      getMyEvl();
    });
  }

  function getEvaluations() {
    ctrl.evaluations = $scope.$meteorCollection(function() { 
      return Evaluations.find({ moveId: ctrl.move._id, active: true });
    }, false);
  }

  function calcRelativeScore() {
    return Protocol.calcRelativeScore(ctrl.evaluations, ctrl.activeReputationSum);
  }

  function calcRelativeConfidence() {
    return Protocol.calcRelativeConfidence(ctrl.evaluations, ctrl.activeReputationSum);
  }

  function getMyEvl() {
    ctrl.myEvl = $scope.$meteorObject(Evaluations, { 
      moveId: ctrl.move._id, 
      uid: Meteor.userId(), 
      active: true
    }, false);
    
    if (ctrl.myEvl)
      ctrl.myRating = ctrl.myEvl.stars;
  }

  function rate(stars, oldStars) {
    if (stars)
      Evaluation.rate(ctrl.move.gameId, ctrl.move._id, ctrl.move.turnIndex, ctrl.move.notation, stars);
  }

}


function getDisabledRateText() {
  if (!Meteor.userId())
    return 'Must be logged in to evaluate moves';
  if (!Meteor.user().reputation)
    return 'Must have reputation to evaluate moves';
}