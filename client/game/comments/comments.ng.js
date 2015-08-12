angular.module('blockchess.game.comments', [])
.directive('comments', comments);

function comments() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/comments/comments.ng.html",
    controller: commentsController,
    restrict: 'E',
    scope: { comments: '=', move: '=' }
  };
}

function commentsController() {
  var ctrl = this;
  angular.extend(ctrl, {
    getUserBy: getUserBy,
    create: create,
    mover: {}
  });

  init();

  function init() {
    ctrl.mover = getUserBy(ctrl.move.uid);
  }

  function create() {
    ctrl.comments.push({
      moveId: ctrl.move._id,
      uid: Meteor.userId(),
      createdAt: Date.now(),
      text: ctrl.newComment.body
    });
    ctrl.newComment.body = ''
  }
}
