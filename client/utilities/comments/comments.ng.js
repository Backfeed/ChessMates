angular.module('blockchess.utilities.comments', [])
.directive('comments', comments);

function comments() {
  return {
    restrict: 'E',
    templateUrl: "client/utilities/comments/comments.ng.html",
    controller: commentsController,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      move: '=',
      comments: '='
    }
  }
}

function commentsController() {
  var ctrl = this;
  angular.extend(ctrl, {
    getUserById: getUserById,
    add: add
  });

  function getUserById(userId) {
    return Meteor.users.findOne(userId);
  };

  function add() {
    ctrl.comments.push({
      user_id: Meteor.userId(),
      created_at: Date.now(),
      text: ctrl.newComment.body
    });
    ctrl.newComment.body = ''
  }
}
