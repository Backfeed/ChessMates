angular.module('blockchess.game.service', [])
.service('GameService', GameService);

function GameService($meteor, $state, $timeout, Toast, GameModel, ChessValidator, ChessBoard) {
  var ALERT_AUDIO = new Audio('audio/alert.mp3');

  return {
    cancelMoveHighlights: cancelMoveHighlights,
    selectedMoveChanged: selectedMoveChanged,
    formatMoveFrom: formatMoveFrom,
    movePieceBack: movePieceBack,
    updateBoard: updateBoard,
    singleMove: singleMove,
    getSugMoveBy: getSugMoveBy,
    pauseAlert: pauseAlert,
    restart: restart,
    playAlert: playAlert,
    archive: archive,
    isDone: isDone,
    imDone: imDone
  };

  function playAlert() {
    ALERT_AUDIO.play();
  }

  function pauseAlert() {
    if (! ALERT_AUDIO.paused)
      ALERT_AUDIO.pause();
  }

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
