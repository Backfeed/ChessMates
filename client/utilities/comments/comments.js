angular.module('blockchess.utilities.comments', [])
.directive('comments', comments)

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
    users : $meteor.collection(Meteor.users, false).subscribe('users')
  });

  $scope.getUserById = function(userId){
    return Meteor.users.findOne(userId);
  };
}
