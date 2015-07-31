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

  init();

  function init() {
    ctrl.evaluations = $meteor.collection(Evaluations, { moveId: ctrl.move._id }).subscribe('evaluations');
    setIsFavorite();
  }

  function setIsFavorite() {
    isFavorite().then(function(bool) {
      ctrl.isFavorite = bool;
    })
  }

  function isFavorite() {
    return $meteor.call('isFavorite', ctrl.move._id);
  }

  function favor() {
    debugger;
    if (ctrl.isFavorite) {
      if (ctrl.myFavMove._id) { ctrl.myFavMove.moveId = ctrl.move._id }
      else           { $meteor.call('createFavoriteMove', ctrl.move.gameId, ctrl.move.turnIndex, ctrl.move._id) }
    } 
    else {
      $meteor.call('destroyFavoriteMove', ctrl.move._id);
    }
  }

}