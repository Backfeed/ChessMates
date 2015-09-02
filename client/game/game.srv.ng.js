angular.module('blockchess.game.service', [])
.service('GameService', GameService);

function GameService($meteor, $state, $timeout, Toast, GameModel, ChessValidator, ChessBoard, Timer, DesktopNotifier) {

  return {
    notifyNewTurn: notifyNewTurn,
    selectedMoveChanged: selectedMoveChanged,
    formatMoveFrom: formatMoveFrom,
    movePieceBack: movePieceBack,
    updateBoard: updateBoard,
    isTurnAboutToEnd: isTurnAboutToEnd,
    singleMove: singleMove,
    getSugMoveBy: getSugMoveBy,
    restart: restart,
    archive: archive,
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
    ChessBoard.cancelHighlights();
    
    var userIsSure = confirm('Restart the current game?');
    if (userIsSure)
      $meteor.call('restart', gameId);
  }

  function archive(gameId) {
    var userIsSure = confirm('archive the current game?');
    if (userIsSure)
      $meteor.call('archiveGame', gameId).then(success);

    function success() {
      Toast.toast('Game has been archived. Redirecting to games list ...');
      $timeout(function() {
        $state.go('games');
      }, 3000);
    }
  }

  function updateBoard(gameId) {
    ChessBoard.cancelHighlights();
    ChessBoard.board[gameId].position(GameModel.game[gameId].fen);
    ChessValidator.game[gameId].load(GameModel.game[gameId].fen);
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
    ChessBoard.cancelHighlights();
    if (!move || !move.notation) { return; }
    var formatted = formatMoveFrom(move.notation);
    ChessBoard.highlight(formatted.from, formatted.to);
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

  function isTurnAboutToEnd(gameId) {
    return Timer.getTurnTimeLeft(gameId) < 7000;
  }

  function notifyNewTurn (turnIndex) {
    // TODO :: Add user's changes: rep, tokens
    // TODO :: Add msg if user's move was chosen
    var msg = 'Turn ' + turnIndex + ' has begun!';
    DesktopNotifier.notify(msg);

  }

}