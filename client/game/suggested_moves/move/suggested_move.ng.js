angular.module('blockchess.game.suggestedMoves.move', [
  // Service
  'blockchess.game.suggestedMoves.move.evaluation',
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
    scope: { move: '=' }
  };
}

function suggestedMoveController($meteor, $scope, Evaluation) {
  var ctrl = this;
  angular.extend(ctrl, {
    getDisabledRateText: getDisabledRateText,
    getConfidence: getConfidence,
    rate: rate,
    canRate: Evaluation.canRate,
    evaluations: [],
    myEvl: {}
  });

  $scope.$watch('ctrl.myRating', rate);

  init();

  function init() {
    $meteor.subscribe('evaluations').then(function() {
      getEvaluations();
      getMyEvl();
    });
  }

  function getEvaluations() {
    ctrl.evaluations = $meteor.collection(function() { 
      return Evaluations.find({ moveId: ctrl.move._id, moveId: ctrl.move.turnIndex }); 
    }, false);
  }

  function getConfidence() {
    return Protocol.getMoveStats(ctrl.move).confidence;
  }

  function getMyEvl() {
    ctrl.myEvl = $meteor.object(Evaluations, { 
      moveId: ctrl.move._id, 
      uid: Meteor.userId(), 
      inactive: false 
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