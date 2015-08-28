angular.module('blockchess.game.service', [])
  .service('GameService', GameService);

function GameService($meteor, Toast, GameModel, ChessValidator, ChessBoard) {

  return {
    cancelMoveHighlights: cancelMoveHighlights,
    selectedMoveChanged: selectedMoveChanged,
    formatMoveFrom: formatMoveFrom,
    movePieceBack: movePieceBack,
    updateBoard: updateBoard,
    singleMove: singleMove,
    getSugMoveBy: getSugMoveBy,
    restart: restart,
    isDone: isDone,
    imDone: imDone
  };

  function isDone(gameId, uid) {
    if (!GameModel.game[gameId].playedThisTurn) { return false; }
    return GameModel.game[gameId].playedThisTurn.indexOf(uid || Meteor.userId()) > -1;
  }

  function imDone(gameId) {
    $meteor.call('clientDone', gameId).then(
      function()    { Toast.toast('Waitin fo the gang, ya'); },
      function(err) { console.log('failed', err); }
    );
  }

  function restart(gameId) {
    cancelMoveHighlights();
    $meteor.call('restart', gameId);
  }

  function updateBoard(gameId) {
    debugger
    ChessBoard.board[gameId].position(GameModel.game[gameId].fen);
    ChessValidator.game[gameId].load(GameModel.game[gameId].fen);
    cancelMoveHighlights();
  }

  function getSugMoveBy(sugMoves, attr, val) {
    return _.find(sugMoves, function(m) {
      return m[attr] === val;
    });
  }

  function formatMoveFrom(notation) {
    return {
      from: notation.substr(0,2),
      to: notation.substr(2)
    }
  }

  function selectedMoveChanged(move) {
    cancelMoveHighlights();
    if (!move || !move.notation) { return; }
    var formatted = formatMoveFrom(move.notation);
    $('.square-'+formatted.from + ', .square-'+formatted.to).addClass('highlight-square');
  }

  function cancelMoveHighlights() {
    $('.highlight-square').removeClass('highlight-square');
  }

  function movePieceBack(gameId) {
    setTimeout(function(){
      ChessValidator.game[gameId].undo();
      ChessBoard.board[gameId].position(ChessValidator.game[gameId].fen())
    }, 1500);
  }

  function singleMove(gameId, notation) {
    var turnIndex = GameModel.game[gameId].turnIndex;
    var fen = ChessValidator.game[gameId].fen();
    
    $meteor.call('createSugMov', gameId, turnIndex, notation, fen)
  }

}
