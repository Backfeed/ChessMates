angular.module('blockchess.game.comments', [])
.directive('comments', comments);

function comments() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/games/util/comments/comments.ng.html",
    controller: commentsController,
    restrict: 'E',
    scope: { comments: '=', move: '=' }
  };
}

function commentsController() {
  var ctrl = this;
  angular.extend(ctrl, {
    getUserById: getUserById,
    create: create
  });

  function getUserById(userId) {
    return Meteor.users.findOne(userId);
  };

  function create() {
    ctrl.comments.push({
      userId: Meteor.userId(),
      createdAt: Date.now(),
      text: ctrl.newComment.body
    });
    ctrl.newComment.body = ''
  }
}
