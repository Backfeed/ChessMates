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
    scope: { move: '=', myFavMove: '=' }
  };
}

function suggestedMoveController($meteor, $scope) {
  var ctrl = this;
  angular.extend(ctrl, {
    favor: favor,
    count: 0,
    evaluations: []
  });

  init();

  $meteor.autorun($scope, function() {
    $meteor.subscribe('favoriteMoves', {}, ctrl.move._id).then(function() {
      // ctrl.count = $meteor.object(Counts ,'favoriteMovesCount', false);
      // TOdo :: Remove this once counts works
      ctrl.favMoves = $meteor.collection(function () { return FavoriteMoves.find({ moveId: ctrl.move._id }) });
    });
  });

  function init() {
    ctrl.evaluations = $meteor.collection(function() { return Evaluations.find({ moveId: ctrl.move._id }); }).subscribe('evaluations');
  }

  function favor() {
    $meteor.call('favor', ctrl.move._id, ctrl.move.turnIndex, ctrl.move.gameId);
  }
}