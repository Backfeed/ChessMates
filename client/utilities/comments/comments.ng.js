angular.module('blockchess.utilities.comments', [])
.directive('comments', comments);

function comments() {
  return {
    restrict: 'E',
    templateUrl: "client/utilities/comments/comments.ng.html",
    controller: commentsController,
    scope: {
      move: '=',
      comments: '='
    }
  }
}

function commentsController($scope, $meteor, $interval, TIME_PER_MOVE) {
  angular.extend($scope, {
    add: add
  });

  $scope.getUserById = function(userId){
    return Meteor.users.findOne(userId);
  };

  function add() {
    $scope.comments.push({
      user_id: Meteor.userId(),
      created_at: Date.now(),
      text: $scope.newComment.body
    });
    $scope.newComment.body = ''
  }
}
