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

function FeedController($scope, $meteor, Toast, ChessBoard) {
  var ctrl = this;

  angular.extend(ctrl, {
    highlightBoard: highlightBoard,
    unHighlightBoard: unHighlightBoard,
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
  
  function highlightBoard(item) {
    var squares = getSquares(item);
    ChessBoard.highlight(squares);
  }

  function unHighlightBoard(item) {
    var squares = getSquares(item);
    ChessBoard.unHighlight(squares);
  }

  function getSquares(item) {
    return item.text.match(/[a-h][1-8]/g);
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