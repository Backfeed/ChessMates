angular.module('blockchess.game.suggestedMoves.move', [
  // Directives
  'blockchess.game.suggestedMoves.move.myRating',
  // Filters
  'blockchess.game.suggestedMoves.move.favoriteCountByRep',
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
    getDisabledRateText: getDisabledRateText,
    canRate: canRate,
    favor: favor,
    count: 0,
    evaluations: []
  });

  init();

  function init() {
    getEvaluations();
    getFavMoves();
    getComments();
  }

  function getFavMoves() {
    $meteor.subscribe('favoriteMoves', {}, ctrl.move._id).then(function() {
      // ctrl.count = $meteor.object(Counts ,'favoriteMovesCount', false);
      // TOdo :: Remove this once counts works
      ctrl.favMoves = $meteor.collection(function () { return FavoriteMoves.find({ moveId: ctrl.move._id }) });
    });
  }

  function getEvaluations() {
    ctrl.evaluations = $meteor.collection(function() { return Evaluations.find({ moveId: ctrl.move._id }); }).subscribe('evaluations');
  }

  function getComments() {
    ctrl.comments = $meteor.collection(function() { return Comments.find({ moveId: ctrl.move._id }); }).subscribe('comments');
  }

  function favor() {
    $meteor.call('favor', ctrl.move._id, ctrl.move.turnIndex, ctrl.move.gameId);
  }

  function canRate() {
    return !!Meteor.userId() && Meteor.user().reputation;
  }

  function getDisabledRateText() {
    if (!Meteor.userId())
      return 'Must be logged in to evaluate moves'
    if (!Meteor.user().reputation)
      return 'Must have reputation to evluate moves'
  }

}