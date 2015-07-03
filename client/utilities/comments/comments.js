angular.module('blockchess.utilities.comments', [])
.directive('comments', comments)

function comments() {
  return {
    restrict: 'E',
    templateUrl: "client/utilities/comments/comments.ng.html",
    controller: commentsController,
    scope: { comments: '=', selected_move: '=' }
  }
}

function commentsController($rootScope, $scope) {
  angular.extend($scope, {
    addComment: addComment
  });

  function addComment() {
    console.log($scope.comment);
    $scope.comments.push({
      user_id: $rootScope.currentUser._id,
      game_id: "1",
      suggested_move_id: $scope.selected_move._id,
      body: $scope.comment.body
    });
    $scope.comment = ''
  }
}
