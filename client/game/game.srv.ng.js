angular.module('blockchess.game.service', [])
  .service('GameService', GameService);

function GameService($meteor, Toast, GameModel, ChessValidator, ChessBoard) {
  var gameId = "1"; // Dev

  return {
    cancelMoveHighlights: cancelMoveHighlights,
    selectedMoveChanged: selectedMoveChanged,
    formatMoveFrom: formatMoveFrom,
    movePieceBack: movePieceBack,
    updateBoard: updateBoard,
    singleMove: singleMove,
    getMoveBy: getMoveBy,
    restart: restart,
    isDone: isDone,
    imDone: imDone
  };

  function isDone(id) {
    if (!GameModel.game.playedThisTurn) { return false; }
    //if (GameModel.suggestedMoves.length < 1) { return false; }
    return GameModel.game.playedThisTurn.indexOf(id || Meteor.userId()) > -1;
  }

  function imDone(gameId) {
    $meteor.call('clientDone', gameId).then(
      function()    { Toast.toast('Waitin fo the gang, ya'); },
      function(err) { console.log('failed', err); }
    );
  }

  function restart() {
    cancelMoveHighlights();
    Meteor.call('restart', gameId);
  }

  function updateBoard() {
    ChessBoard.board.position(GameModel.game.fen);
    ChessValidator.game.load(GameModel.game.fen);
    cancelMoveHighlights();
  }

  function getMoveBy(attr, val) {
    return _.find(GameModel.suggestedMoves, function(m) {
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

  function movePieceBack() {
    setTimeout(function(){
      ChessValidator.game.undo();
      ChessBoard.board.position(ChessValidator.game.fen())
    }, 1500);
  }

  function singleMove(notation) {
    GameModel.suggestedMoves.push({
      turnIndex: GameModel.game.turnIndex,
      createdAt: Date.now(),
      notation: notation,
      uid: Meteor.userId(),
      gameId: "1",
      fen: ChessValidator.game.fen()
    });
  }

}
