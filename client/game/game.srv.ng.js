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
    startTurn: startTurn,
    endGame: endGame,
    restart: restart,
    isDone: isDone,
    imDone: imDone,
    pause: pause
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

  function pause(gameId) {
    $meteor.call('pauseGame', gameId).then(
      function() {
        GameModel.timer.inPlay = !GameModel.timer.inPlay;
        Toast.toast('game paused');
      },
      function(err) { console.log('failed', err); }
    );
  }

  function startTurn(gameId) {
    $meteor.call('startTurn', gameId).then(
      function()    { Toast.toast('turn started'); },
      function(err) { console.log('failed', err); }
    );
  }

  function endGame(gameId) {
    $meteor.call('endGame', gameId).then(
      function()    { Toast.toast('No Move Suggested. Game Over!!'); },
      function(err) { console.log('failed', err); }
    );
  }

  function restart() {
    cancelMoveHighlights();
    Meteor.call('restart', gameId);
  }

  function updateBoard() {
    console.log("history: updateBoard: ", ChessValidator.getHistory());
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
      userId: Meteor.userId(),
      gameId: "1",
      fen: ChessValidator.game.fen()
    });
  }

}
