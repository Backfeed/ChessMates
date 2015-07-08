angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($scope, $meteor, CommonService, Engine, GamesService, GamesModel) {
  var gameId = "1"; // TODO: Get dynamically from current game
  var ctrl = this;

  angular.extend(ctrl, {
    executeMove: executeMove,
    evaluate: evaluate, // DEV ONLY
    start: start, // DEV ONLY
    GamesModel: GamesModel, // DEV ONLY
    pause: pause, // DEV ONLY
    stop: stop, // DEV ONLY
    restart: restart, // DEV ONLY
    Engine : Engine, // DEV ONLY
    game: {},
    selectedMove  : {},
    fen            : 'start'
  });

  // What does this do? Let's saparate between the function and the watcher?
  $scope.$watch('ctrl.game.fen', function() {
    if (ctrl.game.fen && ctrl.fen !== ctrl.game.fen) {
      ctrl.boardGame.load(ctrl.game.fen);
      ctrl.board.position(ctrl.game.fen);
      ctrl.fen = ctrl.game.fen;
    }
  });

  //TODO why not inject a service here? could we avoid broadcasting data to the whole app?
  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GamesService.selectedMoveChanged);
  $scope.$watch('ctrl.game.status', executeMoveOnTime);

  init();

  function init() {
    GamesModel.set(gameId);
    ctrl.game = GamesModel.game;
  }

  function evaluate(moves) {
    Engine.evaluate(moves).then(function(score) {
      console.log('score is ', score);
    })
  }

  // For development

  function start() {
    if (ctrl.game.settings.inPlay)
      return;

    $meteor.call('startGame', gameId).then(
      function(data){
        //$scope.game.settings.inPlay = true;
        console.log('game started');
      },
      function(err){
        console.log('failed', err);
      }
    );
  };

  function pause() {
    //if (!ctrl.game.settings.inPlay)
    //  return;

    $meteor.call('pauseGame', gameId).then(
      function(data){
        ctrl.game.settings.inPlay = false;
        console.log('game paused');
      },
      function(err){
        console.log('failed', err);
      }
    );
  };

  function stop() {
    //if (!ctrl.game.settings.inPlay)
    //  return;

    $meteor.call('stopGame', gameId).then(
      function(data){
        ctrl.game.settings.inPlay = false;
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
  }

  function executeMoveOnTime(){
    var status = ctrl.game.status;
    if(status === 'AI'){
      executeMove();
    }
  }

  function executeMove() {
    GamesService.cancelMoveHighlights();
    //TODO if no suggested move game over
   if (ctrl.game.suggested_moves.length === 0){
     console.log('Timer neded with no suggested moves!');
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
    ctrl.fen = ctrl.boardGame.fen(); // save for returning the piece to before suggestion position
    ctrl.game.fen = ctrl.boardGame.fen(); //TODO all users should see the updated position
    ctrl.game.pgn = ctrl.boardGame.pgn();
    GamesModel.logTurn();
    start();
  }

  function singleMove(e, notation) {
    if (!$scope.currentUser) {
      CommonService.toast('Must be logged in to suggest a move');
      ctrl.boardGame.undo();
      ctrl.board.position(ctrl.fen);
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
      .then(function(response) {
        // TODO Add response to evaluation
        console.log(response);
        ctrl.game.suggested_moves.push({
          user_id: Meteor.userId(),
          notation: notation,
          avg_stars: '4.5',
          created_at: Date.now(),
          fen: ctrl.boardGame.fen(),
          comments: []
        });
      })
      .finally(function() {
        movePieceBack();
      });
    }
  }

  function movePieceBack() {
    ctrl.boardGame.undo();
    ctrl.board.position(ctrl.fen);
  }

}