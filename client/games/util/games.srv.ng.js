angular.module('blockchess.games.util.service', [])
.service('GamesService', GamesService);

function GamesService($q, $window, $meteor, $mdDialog, CommonService, Engine, EvaluationModel, GamesModel, GameBoardService, BoardService) {
  var gameId = "1"; // Dev

  return {
    cancelMoveHighlights: cancelMoveHighlights,
    selectedMoveChanged: selectedMoveChanged,
    formatMoveFrom: formatMoveFrom,
    updateBoard: updateBoard,
    startTurnCB: startTurnCB,
    singleMove: singleMove,
    userIsDone: userIsDone,
    getMoveBy: getMoveBy,
    startTurn: startTurn,
    endGame: endGame,
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
      function(){
        GamesModel.game.settings.inPlay = !GamesModel.game.settings.inPlay;
        CommonService.toast('game paused');
      },
      function(err){
        console.log('failed', err);
      }
    );
  }

  function moveAI(move) {
    GameBoardService.game.move({ from: move.from, to: move.to, promotion: move.promotion });
    GamesModel.game.fen = GameBoardService.game.fen();
    GamesModel.game.pgn.push(move.from + ' ' + move.to);
    GamesModel.logTurn();
    startTurn(gameId);
  }

  function startTurn(gameId) {
    $meteor.call('startTurn', gameId).then(
      function()    { CommonService.toast('turn started'); },
      function(err) { console.log('failed', err); }
    );
  }

  function executeMove() {
    //TODO get move from protocol
    GameBoardService.game.move(formatMoveFrom(GamesModel.game.suggested_moves[0].notation));
    Engine.getMove(GameBoardService.getHistory())
    .then(function(move) {
      moveAI(move);
    });
  }

  function endGame(gameId) {
    $meteor.call('endGame', gameId).then(
      function()    { CommonService.toast('No Move Suggested. Game Over!!'); },
      function(err) { console.log('failed', err); }
    );
  }

  function startTurnCB(turn) {
    cancelMoveHighlights();
    CommonService.toast('It Is ' + turn + ' Turn To Play');
    if (turn === 'AI') {
      if (GamesModel.game.suggested_moves.length === 0) {
        endGame();
      } else {
        executeMove();
      }
    }
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
    GameBoardService.game.load(GamesModel.game.fen);
    BoardService.board.position(GamesModel.game.fen);
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
      GamesModel.gameNotAuto.suggested_moves.push(move);
      EvaluationModel.evaluate(move, stars);
    })
    .finally(function() {
      movePieceBack();
    });

    return deferred.promise;
  }

  function restart() {
    cancelMoveHighlights();
    GameBoardService.game.reset();
    BoardService.board.position('start');
    GamesModel.restart();
    $window.ClientsDone = [];
    startTurn(gameId);
  }

  function userIsDone(id) {
    var bool = false;
    $window.ClientsDone.forEach(function(userId) {
      if (userId === id) { return bool = true; }
    });
    return bool;
  }

}
