angular.module('blockchess.games.util.boardService', [])
.service('BoardService', BoardService)

function BoardService($rootScope, $window, GamesModel, GameBoardService) {
  var cfg = {
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  };

  var Board = {
    init: init,
    board: {}
  };

  return Board;

  function init(gameId) {
    Board.board = new $window.ChessBoard('board', cfg);
  }

  function onDragStart(source, piece, position, orientation) {
    return !GameBoardService.game.game_over();
  };

  function onDrop(source, target) {
    var move = GameBoardService.game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    // illegal move
    if (move === null) { return 'snapback'; }
    var notation = source + target;
    $rootScope.$broadcast('singleMove', notation);
  };

  function onSnapEnd() {
      Board.board.position(GameBoardService.game.fen());
  };
}