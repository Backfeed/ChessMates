angular.module('blockchess.game.chess.boardService', [])
.service('ChessBoard', ChessBoard);

function ChessBoard($rootScope, $window, $injector, GameModel, ChessValidator, ToastService) {
  var getMoveBy;
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
    getMoveBy = getMoveBy || $injector.get('GameService').getMoveBy;
    if (ChessValidator.game.game_over()) {
      ToastService.toast('Game is over');
      return false;
    }

    if (!Meteor.userId()) {
      ToastService.toast('Must be logged in to play!');
      return false;
    }

    if (getMoveBy('userId', Meteor.userId())) {
      ToastService.toast('Can only suggest one move per turn');
      return false;
    } 

    if (Meteor.user().tokens < 1) {
      ToastService.toast('Suggesting a move costs 1 token, you have ' + Meteor.user().tokens);
      return false;
    }

    return true;
  };

  function onDrop(source, target) {
    var notation = source + target;

    if (getMoveBy('notation', notation)) {
      ToastService.toast('move exists');
      return false;
    }

    var move = ChessValidator.game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    // illegal move
    if (move === null) { return 'snapback'; }
    $rootScope.$broadcast('singleMove', notation);
  };

  function onSnapEnd() {
      Board.board.position(ChessValidator.game.fen());
  };

}