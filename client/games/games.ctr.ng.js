angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($scope, $meteor, CommonService, Engine, GamesService, GamesModel, EvaluationModel, BoardService) {
  var gameId = "1"; // TODO: Get dynamically from current game
  var ctrl = this;

  angular.extend(ctrl, {
    executeMove: executeMove,
    evaluate: evaluate, // DEV ONLY
    GamesModel: GamesModel, // DEV ONLY
    startTurn: startTurn, // DEV ONLY
    pause: pause, // DEV ONLY
    BoardService: BoardService, // DEV ONLY
    endGame: endGame, // DEV ONLY
    restart: restart, // DEV ONLY
    Engine : Engine, // DEV ONLY
    gameId : gameId, // DEV ONLY
    game: {},
    selectedMove  : {}
  });


  //TODO why not inject a service here? could we avoid broadcasting data to the whole app?
  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GamesService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard);

  init();

  function init() {
    GamesModel.set(gameId);
    ctrl.game = GamesModel.game;
    whosTurnStream.on('whosTurn', makeTurn);
  }

  function updateBoard() {
    if (ctrl.boardGame && ctrl.boardGame.fen() !== ctrl.game.fen) {
      ctrl.boardGame.load(ctrl.game.fen);
      ctrl.board.position(ctrl.game.fen);
    }
  }

  function evaluate(moves) {
    Engine.evaluate(moves).then(function(score) {
      console.log('score is ', score);
    })
  }

  // For development

  function startTurn() {
    $meteor.call('startTurn', gameId).then(
      function(){
        console.log('turn started');
      },
      function(err){
        console.log('failed', err);
      }
    );
  };

  function pause() {
    $meteor.call('pauseGame', gameId).then(
      function(){
        ctrl.game.settings.inPlay = !ctrl.game.settings.inPlay;
        console.log('game paused');
      },
      function(err){
        console.log('failed', err);
      }
    );
  };

  function endGame() {
    $meteor.call('endGame', gameId).then(
      function(){
        console.log('game stopped');
      },
      function(err){
        console.log('failed', err);
      }
    );
  };

  function restart () {
    GamesService.cancelMoveHighlights();
    ctrl.boardGame.reset();
    ctrl.board.position('start');
    GamesModel.restart();
    startTurn();
  }

  function makeTurn(turn) {
    CommonService.toast('It Is ' + turn + ' Turn To Play');
    if(turn === 'AI'){
      executeMove();
    }
  }

  function executeMove() {
    GamesService.cancelMoveHighlights();
    //TODO if no suggested move game over
   if (ctrl.game.suggested_moves.length === 0){
     endGame();
     CommonService.toast('No Move Suggested. Game Over!!');
     return;
   }
    //TODO fix this. For now pressing the button will play the first selected move(for dev)
    ctrl.boardGame.move(GamesService.formatMoveFrom(ctrl.game.suggested_moves[0].notation));
    ctrl.board.position(ctrl.game.suggested_moves[0].fen);
    Engine.getMove(ctrl.boardGame.history({ verbose: true }).map(function(move){ return move.from + move.to }).join(" "))
    .then(function(move) {
      moveAI(move);
    });
  }

  function moveAI(move) {
    ctrl.boardGame.move({ from: move.from, to: move.to, promotion: move.promotion });
    ctrl.board.position(ctrl.boardGame.fen());
    ctrl.game.fen = ctrl.boardGame.fen(); //TODO all users should see the updated position
    ctrl.game.pgn = ctrl.boardGame.pgn();
    GamesModel.logTurn();
    startTurn();
  }

  function singleMove(e, notation) {
    if (!$scope.currentUser) {
      CommonService.toast('Must be logged in to suggest a move');
      movePieceBack();
      return;
    } else if (GamesService.getMoveBy('user_id', $scope.currentUser._id)) {
      CommonService.toast('Can only suggest one move per turn');
      ctrl.selectedMove = GamesService.getMoveBy('user_id', $scope.currentUser._id);
      movePieceBack();
    } else if (GamesService.getMoveBy('notation', notation)) {
      CommonService.toast('move exists');
      ctrl.selectedMove = GamesService.getMoveBy('notation', notation);
      movePieceBack();
    } else {
      GamesService.openSuggestMoveModal(notation)
      .then(function(stars) {
          var move = {
            user_id: Meteor.userId(),
            notation: notation,
            avg_stars: '4.5',
            created_at: Date.now(),
            fen: ctrl.boardGame.fen(),
            evaluations: [],
            comments: []
          };
          EvaluationModel.evaluate(move, stars);
          ctrl.game.suggested_moves.push(move);
      })
      .finally(function() {
        movePieceBack();
      });
    }
  }

  function movePieceBack() {
    ctrl.boardGame.undo();
    ctrl.board.position(ctrl.boardGame.fen());
  }

}
