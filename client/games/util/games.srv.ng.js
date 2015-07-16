angular.module('blockchess.games.util.service', [])
  .service('GamesService', GamesService);

function GamesService($q, $window, $meteor, $mdDialog, CommonService, EvaluationModel, GamesModel, GameBoardService, BoardService) {
  var gameId = "1"; // Dev
  movesStream.on('move', onMove);
  restartStream.on('restart', onRestart);

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
    imDone: imDone,
    pause: pause
  };


  function imDone(gameId) {
    $meteor.call('clientDone', gameId).then(
      function()    { CommonService.toast('Waitin fo the gang, ya'); },
      function(err) { console.log('failed', err); }
    );
  }

  function pause(gameId) {
    $meteor.call('pauseGame', gameId).then(
      function() {
        GamesModel.game.settings.inPlay = !GamesModel.game.settings.inPlay;
        CommonService.toast('game paused');
      },
      function(err) { console.log('failed', err); }
    );
  }

  function startTurn(gameId) {
    $meteor.call('startTurn', gameId).then(
      function()    { CommonService.toast('turn started'); },
      function(err) { console.log('failed', err); }
    );
  }

  function endGame(gameId) {
    $meteor.call('endGame', gameId).then(
      function()    { CommonService.toast('No Move Suggested. Game Over!!'); },
      function(err) { console.log('failed', err); }
    );
  }

  function openSuggestMoveModal(notation) {
    return $mdDialog.show({
      bindToController: true,
      controllerAs: 'ctrl',
      templateUrl: "client/games/util/suggest_move_modal/suggest_move_modal.ng.html",
      controller: 'suggestMoveModalController',
      locals: { notation: notation }
    });
  }

  function updateBoard() {
    console.log("history: updateBoard: ", GameBoardService.getHistory());
    BoardService.board.position(GamesModel.game.fen);
    cancelMoveHighlights();
  }

  function getMoveBy(attr, val) {
    var move;
    GamesModel.game.suggested_moves.forEach(function(m) {
      if (m[attr] === val) { move = m; }
    });
    return move;
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
    GameBoardService.game.undo();
    BoardService.board.position(GameBoardService.game.fen());
  }

  function singleMove(e, notation) {
    var deferred = $q.defer();

    // TODO :: Delete this check
    if (!Meteor.userId()) {
      CommonService.toast('Must be logged in to suggest a move');
      movePieceBack();
      deferred.resolve({});
      return deferred.promise;
    }

    if (getMoveBy('user_id', Meteor.userId())) {
      CommonService.toast('Can only suggest one move per turn');
      deferred.resolve(getMoveBy('user_id', Meteor.userId()));
      movePieceBack();
      return deferred.promise;
    }

    if (getMoveBy('notation', notation)) {
      CommonService.toast('move exists');
      deferred.resolve(getMoveBy('notation', notation));
      movePieceBack();
      return deferred.promise;
    }

    openSuggestMoveModal(notation)
      .then(function(stars) {
        var move = {
          user_id: Meteor.userId(),
          notation: notation,
          avg_stars: '4.5',
          created_at: Date.now(),
          fen: GameBoardService.game.fen(),
          evaluations: [[],[],[],[],[]],
          comments: []
        };
        deferred.resolve(move);

        var existingMove = _.find(GamesModel.gameNotAuto.suggested_moves, function(sug_move) {
          return sug_move.notation === move.notation;
        });
        console.log(existingMove);

        GamesModel.gameNotAuto.suggested_moves.push(move);
        EvaluationModel.evaluate(move, stars);
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
    CommonService.toast('Turn changed');
    GameBoardService.game.move(move);
  }

  function onRestart() {
    console.log('onRestart called!');
    cancelMoveHighlights();
    GameBoardService.game.reset();
  }

}
