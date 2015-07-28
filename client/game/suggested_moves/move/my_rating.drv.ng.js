angular.module('blockchess.game.suggestedMoves.move.myRating', [])
.directive('myRating', myRating);

function myRating($meteor) {
  return {
    link: function(scope, elem, attrs) {
      elem.on('click', rate);
      init();

      function init() {
        get();
      }

      function get() {
        $meteor.subscribe('evaluations').then(function() {
          var myEval = getEval();
          if (myEval)
            scope.myRating = myEval.stars;
        });
      }
      
      function rate() { Meteor.call('rate', attrs.moveId, scope.myRating); }

      function getEval() {
        return $meteor.object(Evaluations, { moveId: attrs.moveId, userId: Meteor.userId() });
      }
    }
  }
}
