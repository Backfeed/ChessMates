angular.module('blockchess.game.comments', [])
.directive('comments', comments);

function comments() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/comments/comments.ng.html",
    controller: commentsController,
    restrict: 'E',
    scope: {}
  };
}

function commentsController($scope, $state, $meteor, GameModel) {
  var ctrl = this;
  angular.extend(ctrl, {
    create: create,
    getUserBy: getUserBy,
    turnIndex: 0,
    comments: []
  });

  init();

  Tracker.autorun(function() {
    ctrl.turnIndex = Session.get('turnIndex');
    $meteor.subscribe('comments', "1", ctrl.turnIndex);
  });


  function init() {
    $meteor.subscribe('comments', "1", $scope.getReactively('ctrl.turnIndex')).then(function() {
      ctrl.comments = $meteor.collection(function() {
        return Comments.find({ gameId: "1", turnIndex: $scope.getReactively('ctrl.turnIndex') });
      }, false);
    });
  }

  function create() {
    var gameId = GameModel.game.gameId;
    var turnIndex = GameModel.game.turnIndex;
    var text = ctrl.newComment.body;
    Meteor.call('createComment', gameId, turnIndex, text);
    ctrl.newComment.body = ''
  }

  function getUserBy(uid) {
    return F.getUserBy(uid);
  }
}