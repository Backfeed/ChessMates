angular.module('blockchess.game.chess.boardService', [])
.service('ChessBoard', ChessBoard)

function ChessBoard($rootScope, $window, GameModel, ChessValidator) {
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
    return !ChessValidator.game.game_over();
  };

  function onDrop(source, target) {
    var move = ChessValidator.game.move({
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
      Board.board.position(ChessValidator.game.fen());
  };
}