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

function FeedController($meteor, Toast) {
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
    $meteor.subscribe('feeds').then(function() {
      ctrl.items = $meteor.collection(function() {
        return Feeds.find({ gameId: ctrl.gameId });
      }, false);
    });
  }

  function createComment() {
    if (Meteor.userId()) {
      Meteor.call('log', ctrl.gameId, ctrl.turnIndex, ctrl.newComment, 'comment');
      ctrl.newComment = '';
    } else {
      Toast.toast('Log in to comment');
    }
  }

}