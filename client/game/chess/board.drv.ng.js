angular.module('blockchess.game.chess.board', [])
.directive('board', board)

function board(ChessBoard) {
  return {
    template: '<div id="board"></div>',
    scope: {},
    link: function(scope, elem, attrs) {
      ChessBoard.init(attrs.board);
    }
  }
}