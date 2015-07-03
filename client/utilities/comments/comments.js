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
    add: add,
    users : $meteor.collection(Meteor.users, false).subscribe('users')
  });

  $scope.getUserById = function(userId){
    return Meteor.users.findOne(userId);
  };

  function add() {
    console.log($scope.comment);
    $scope.comments.push({
      user_id: $rootScope.currentUser._id,
      game_id: "1",
      suggested_move_id: $scope.selectedMove._id,
      body: $scope.newComment.body
    });
    $scope.newComment.body = ''
  }
}
