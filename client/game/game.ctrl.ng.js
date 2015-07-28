angular.module('blockchess.game.controller', [])
.controller('GameController', GameController)

function GameController($scope, $state, GameService, GameModel, ChessBoard, ChessValidator) {
  var gameId = "1";
  var ctrl = this;

  angular.extend(ctrl, {
    ChessValidator: ChessValidator, // DEV
    ChessBoard: ChessBoard, // DEV
    GameModel: GameModel, // DEV
    startTurn: startTurn, // DEV
    endGame: endGame, // DEV
    restart: restart, // DEV
    gameId: gameId, // DEV
    pause: pause, // DEV
    isDone: isDone,
    imDone: imDone,
    selectedMove: {},
    timer: {},
    status: {},
    game: {}
  });

  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GameService.selectedMoveChanged);
  //TODO why use 'true' here? it's a string
  $scope.$watch('ctrl.game.fen', updateBoard, true);
  $scope.$watch('ctrl.status.turn', onTurn, true);
  $scope.$watch('ctrl.status.restarted', onRestart, true);

  init();

  function init() {
    GameModel.set(gameId);
    ctrl.game = GameModel.game;
    ctrl.timer = GameModel.timer;
    ctrl.status = GameModel.status;
  }

  function startTurn()       { GameService.startTurn(gameId); }
  function endGame()         { GameService.endGame(gameId);   }
  function restart()         { GameService.restart();         }
  function isDone()   { return GameService.isDone();          }
  function imDone()          { GameService.imDone(gameId);    }
  function pause()           { GameService.pause(gameId);     }

  function onRestart() {
    if (ctrl.status) {
      GameService.onRestart();
    }
  }

  function onTurn() {
    if (ctrl.status) {
      GameService.onMove(_.last(ctrl.game.pgn), ctrl.game.turn);
    }
  }

  function updateBoard() {
    if (ctrl.game && ChessValidator.game) {
      GameService.updateBoard();
    }
  }

  function singleMove(e, notation) {
    GameService.singleMove(notation);
  }

}
