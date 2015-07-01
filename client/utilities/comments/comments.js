angular.module('blockchess.utilities.comments', [])
.directive('comments', comments)

function comments() {
  return {
    restrict: 'E',
    templateUrl: "client/utilities/comments/comments.ng.html",
    controller: commentsController,
    scope: { comments: '=' }
  }
}

function commentsController($scope, $interval, TIME_PER_MOVE) {
  angular.extend($scope, {
  });

}
