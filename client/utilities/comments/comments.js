angular.module('blockchess.utilities.comments', [])
.directive('comments', comments)

function comments() {
  return {
    restrict: 'E',
    templateUrl: "client/utilities/comments/comments.ng.html",
    controller: commentsController,
    scope: { selectedMove: '=' }
  }
}

function commentsController($rootScope, $scope, $meteor) {
  angular.extend($scope, {
    add: add,
    comments: $meteor.collection(Comments)
  });

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

  $meteor.autorun($scope, function() {
    if(!$scope.selectedMove) { return }
    $meteor.subscribe('comments', {}, $scope.getReactively('selectedMove')._id).then(function(){
      console.log($scope.comments);
    });
  });
}
