angular.module('blockchess.game.suggestedMoves.move', [
  // Directives
  'blockchess.game.suggestedMoves.move.myRating',
  // Filters
  'blockchess.game.suggestedMoves.move.favoriteCount',
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

function suggestedMoveController($meteor, $scope) {
  var ctrl = this;
  angular.extend(ctrl, {
    evaluations: [],
    favor: favor,
    isFavorite: false
  });

  $scope.$watch('ctrl.evaluations', updateIsFavorite, true);

  init();

  function init() {
    getEvaluations();
  }

  function getEvaluations() {
    $meteor.subscribe('evaluations').then(function() {
      ctrl.evaluations = $meteor.collection(Evaluations, { moveId: ctrl.move._id });
    });
  }

  function updateIsFavorite() {
    if (ctrl.evaluations && ctrl.evaluations.length) {
      $meteor.call('isFavoriteMove', ctrl.move._id).then(function(bool) {
        console.log(bool);
        ctrl.isFavorite = bool;
      })
    }
  }

  function favor() {
    $meteor.call('favor', ctrl.move._id, ctrl.isFavorite);
  }
}