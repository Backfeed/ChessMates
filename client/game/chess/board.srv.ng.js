angular.module('blockchess.game.chess.boardService', [])
.service('ChessBoard', ChessBoard);

function ChessBoard($rootScope, $window, $injector, ChessValidator, Toast, SugMovService) {
  var GameService;
  var cfg = {
  };

  var service = {
    cancelHighlights: cancelHighlights,
    highlight: highlight,
    unHighlight: unHighlight,
    init: init,
    board: {}
  };

  return service;

  function highlight(squares) {
    selector = getSquareSelector(squares);
    $(selector).addClass('highlight-square');
  }

  function unHighlight(squares) {
    selector = getSquareSelector(squares);
    $(selector).removeClass('highlight-square');
  }

  function getSquareSelector(squares) {
    return _.map(squares, addSquarePrefix).join(", ");
  }

  function addSquarePrefix(square) {
    return '.square-' + square;
  }

  function cancelHighlights() {
    $('.highlight-square').removeClass('highlight-square');
  }

  function init(gameId) {
    service.board[gameId] = new $window.ChessBoard('board', getConfig(gameId));
  }

  function getConfig(gameId) {
    return {

      draggable: true,
      onDragStart: R.partial(onDragStart, gameId),
      onDrop: R.partial(onDrop, gameId),
      onSnapEnd: R.partial(onSnapEnd, gameId)

    };
  }

  function onDragStart(gameId, source, piece, position, orientation) {
    if (ChessValidator.game[gameId].game_over()) {
      Toast.toast('Game is over');
      return false;
    }

    if (!Meteor.userId()) {
      Toast.toast('Must be logged in to play!');
      return false;
    }

    var currentUserMoveCount = SugMovService.getCurrentUserMoveCount(gameId);
    if (currentUserMoveCount >= MOVES_PER_TURN) {
      Toast.toast('Can only suggest ' + MOVES_PER_TURN + ' moves per turn');
      return false;
    }

    if (Meteor.user().tokens < MOVE_COST) {
      Toast.toast('Suggesting a move costs ' + MOVE_COST + ' token, you have ' + Meteor.user().tokens);
      return false;
    }

    GameService = GameService || $injector.get('GameService');
    if (GameService.isTurnAboutToEnd(gameId)) {
      Toast.toast('Turn is about to end. No more suggestions please!');
      return false;
    }

    return true;
  }

  function onDrop(gameId, source, target) {
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

  function onSnapEnd(gameId) {
      service.board[gameId].position(ChessValidator.game[gameId].fen());
  }
  
}