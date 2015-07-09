angular.module('blockchess.games.board', [])
.directive('board', board)

function board(BoardService) {
  return {
    template: '<div id="board"></div>',
    scope: {},
    link: function(scope, elem, attrs) {
      BoardService.init(attrs.board);
    }
  }
}