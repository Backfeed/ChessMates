angular.module('blockchess.game.feed', [])
.directive('feed', Feed);

var log = _DEV.log('Feed')

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
    $scope.$meteorSubscribe('feeds', ctrl.gameId).then(function() {
      ctrl.items = $scope.$meteorCollection(Feeds, false);
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