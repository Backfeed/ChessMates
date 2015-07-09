angular.module('blockchess.games.boardService', [])
.service('BoardService', BoardService)

function BoardService($window) {
  var Board = {
    init: init,
    board: {}
  }

  return Board;

  function init() {
    Board.board = new $window.ChessBoard('board');
  }
}