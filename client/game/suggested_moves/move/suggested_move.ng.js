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
    turnIndex: ctrl.move.turnIndex,
    isFavorite: false
  });



  // $meteor.autorun($scope, function() {
  //   $meteor.subscribe('favoriteMoves').then(function() {
  //     ctrl.favoriteMove = $meteor.object(FavoriteMoves, { 
  //       userId: Meteor.userId(),
  //       turnIndex: $scope.getReactively('ctrl.turnIndex')
  //     });
  //   });
  // });

  init();

  function init() {
    ctrl.evaluations = $meteor.collection(function() { return Evaluations.find({ moveId: ctrl.move._id }) }).subscribe('evaluations');
  }

}