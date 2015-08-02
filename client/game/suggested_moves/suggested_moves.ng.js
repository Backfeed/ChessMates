angular.module('blockchess.game.suggestedMoves', [
  // Directives
  'blockchess.game.suggestedMoves.move'
])
.directive('suggestedMoves', suggestedMoves);

function suggestedMoves() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/suggested_moves/suggested_moves.ng.html",
    controller: suggestedMovesController,
    restrict: 'E',
    scope: { turnIndex: '=', selectedMove: '=', suggestedMoves: '=' }
  };
}

function suggestedMovesController($meteor) {
  var ctrl = this;
  angular.extend(ctrl, {
    myFavMove: {},
    toggle: toggle
  });

  init();

  function init() {
    getFavMove();
  }

  function getFavMove() {
    $meteor.subscribe('favoriteMoves').then(function() {
      ctrl.myFavMove = FavoriteMoves.findOne({ turnIndex: ctrl.turnIndex, userId: Meteor.userId() });
    });
  }

  function toggle(move) {
    if (ctrl.selectedMove._id === move._id)
      ctrl.selectedMove = {};
    else
      ctrl.selectedMove = move;
  }

}