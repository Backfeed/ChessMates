angular.module('blockchess.game.suggestedMoves.myRating', [])
.directive('myRating', myRating);

function myRating($meteor) {
  return {
    link: function(scope, elem, attrs) {
      var myEval = $meteor.object(Evaluations, { suggestedMoveId: attrs.moveId, userId: Meteor.userId() }).subscribe('evaluations');
      if (myEval)
        scope.myRating = myEval.stars;
      elem.on('click', rate);

      function rate() {
        Meteor.call('rate', attrs.moveId, scope.myRating);
      }
    }
  }
}
