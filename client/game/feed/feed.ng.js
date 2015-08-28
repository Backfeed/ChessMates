angular.module('blockchess.game.feed', [])
.directive('feed', Feed);

function Feed() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'client/game/feed/feed.ng.html',
    controller: FeedController,
    scope: { gameId: '=', turnIndex: '=' }
  };
}

function FeedController($scope, $meteor, Toast) {
  var ctrl = this;

  angular.extend(ctrl, {
    createComment: createComment,
    showEvaluations: true,
    showComments: true,
    showSugMoves: true,
    showMoves: true,
    newComment: '',
    items: []
  });

  init();

  function init() {
    $scope.$meteorSubscribe('feeds').then(function() {
      ctrl.items = $scope.$meteorCollection(function() {
        return Feeds.find({ gameId: ctrl.gameId });
      }, false);
    });
  }

  function createComment() {
    if (Meteor.userId()) {
      $meteor.call('log', ctrl.gameId, ctrl.turnIndex, ctrl.newComment, 'comment');
      ctrl.newComment = '';
    } else {
      Toast.toast('Log in to comment');
    }
  }

}