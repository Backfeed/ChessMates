angular.module('blockchess.game.service', [])
  .service('GameService', GameService);

function GameService($q, $meteor, $mdDialog, ProtocolService, ToastService, EvaluationModel, GameModel, ChessValidator, ChessBoard) {
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
    onRestart: onRestart,
    onMove: onMove,
    isDone: isDone,
    imDone: imDone,
    pause: pause
  };

  function isDone(id) {
    if (!GameModel.game.playedThisTurn) { return false; }
    return GameModel.game.playedThisTurn.indexOf(id || Meteor.userId()) > -1;
  }

  function imDone(gameId) {
    $meteor.call('clientDone', gameId).then(
      function()    { ToastService.toast('Waitin fo the gang, ya'); },
      function(err) { console.log('failed', err); }
    );
  }

  function pause(gameId) {
    $meteor.call('pauseGame', gameId).then(
      function() {
        GameModel.timer.inPlay = !GameModel.timer.inPlay;
        ToastService.toast('game paused');
      },
      function(err) { console.log('failed', err); }
    );
  }

  function startTurn(gameId) {
    $meteor.call('startTurn', gameId).then(
      function()    { ToastService.toast('turn started'); },
      function(err) { console.log('failed', err); }
    );
  }

  function endGame(gameId) {
    $meteor.call('endGame', gameId).then(
      function()    { ToastService.toast('No Move Suggested. Game Over!!'); },
      function(err) { console.log('failed', err); }
    );
  }

  function openSuggestMoveModal(notation) {
    return $mdDialog.show({
      bindToController: true,
      controllerAs: 'ctrl',
      templateUrl: "client/games/util/suggest_move_modal/suggest_move_modal.ng.html",
      controller: 'suggestMoveModalController',
      locals: { notation: notation, game: GameModel.game }
    });
  }

  function updateBoard() {
    console.log("history: updateBoard: ", ChessValidator.getHistory());
    ChessBoard.board.position(GameModel.game.fen);
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
    ChessValidator.game.undo();
    ChessBoard.board.position(ChessValidator.game.fen());
  }

  function singleMove(notation) {
    var deferred = $q.defer();

    // TODO :: Delete this check
    if (!Meteor.userId()) {
      ToastService.toast('Must be logged in to suggest a move');
      movePieceBack();
      deferred.resolve({});
      return deferred.promise;
    }

    if (getMoveBy('userId', Meteor.userId())) {
      ToastService.toast('Can only suggest one move per turn');
      deferred.resolve(getMoveBy('userId', Meteor.userId()));
      movePieceBack();
      return deferred.promise;
    }

    if (getMoveBy('notation', notation)) {
      ToastService.toast('move exists');
      deferred.resolve(getMoveBy('notation', notation));
      movePieceBack();
      return deferred.promise;
    }

    openSuggestMoveModal(notation)
    .then(function(stars) {
      if (getMoveBy('notation', notation)) {
        EvaluationModel.create(getMoveBy('notation', notation, false), stars);
        deferred.resolve(getMoveBy('notation', notation));
        GameModel.gameNotAuto.save().then(function(){
          ProtocolService.distributeReputation("1", move, stars);
        });
      } else {
        var move = {
          userId: Meteor.userId(),
          notation: notation,
          createdAt: Date.now(),
          fen: ChessValidator.game.fen(),
          evaluations: [],
          comments: []
        };
        deferred.resolve(move);
        EvaluationModel.create(move, stars);
        GameModel.gameNotAuto.suggestedMoves.push(move);
        GameModel.gameNotAuto.save().then(function(){
          ProtocolService.distributeReputation("1", move, stars);
        });
      }
    })
    .finally(function() {
      movePieceBack();
    });

    return deferred.promise;
  }

  function restart() {
    Meteor.call('restart', gameId);
  }

  function onMove(move, turn) {
    console.log('Gameboard Moved! ', move, turn);
    cancelMoveHighlights();
    ToastService.toast('Turn changed');
    ChessValidator.game.move(move);
  }

  function onRestart() {
    console.log('onRestart called!');
    cancelMoveHighlights();
    ChessValidator.game.reset();
  }

}
