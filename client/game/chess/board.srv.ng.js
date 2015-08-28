angular.module('blockchess.game.chess.boardService', [])
.service('ChessBoard', ChessBoard);

function ChessBoard($rootScope, $window, $injector, ChessValidator, Toast) {
  var getSugMoveBy;
  var cfg = {
  };

  var service = {
    init: init,
    board: {}
  };

  return service;

  function init(gameId) {
    console.log(gameId);
    service.board[gameId] = new $window.ChessBoard('board', getConfig(gameId));
  }

  function getConfig(gameId) {
    return {

      draggable: true,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd

    };

    function onDragStart(source, piece, position, orientation) {
      if (ChessValidator.game[gameId].game_over()) {
        Toast.toast('Game is over');
        return false;
      }

      if (!Meteor.userId()) {
        Toast.toast('Must be logged in to play!');
        return false;
      }

      getSugMoveBy = getSugMoveBy || $injector.get('GameService').getSugMoveBy;

      if (getSugMoveBy(gameId, 'uid', Meteor.userId())) {
        Toast.toast('Can only suggest one move per turn');
        return false;
      }

      if (Meteor.user().tokens < MOVE_COST) {
        Toast.toast('Suggesting a move costs ' + MOVE_COST + ' token, you have ' + Meteor.user().tokens);
        return false;
      }

      return true;
    }

    function onDrop(source, target) {
      var notation = source + target;

      var move = ChessValidator.game[gameId].move({
          from: source,
          to: target,
          promotion: 'q'
      });

      // illegal move
      if (move === null) { return 'snapback'; }
      $rootScope.$broadcast('singleMove::'+gameId, notation);
    }

    function onSnapEnd() {
        service.board[gameId].position(ChessValidator.game[gameId].fen());
    }

  }
  
}