angular.module('blockchess.game.controller', [])
.controller('GameController', GameController)

function GameController($scope, GameService, GameModel, ChessBoard, ChessValidator) {
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
    game: {}
  });

  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GameService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard, true);

  init();

  function init() {
    GameModel.set(gameId);
    ctrl.game = GameModel.game;
    ctrl.timer = GameModel.timer;
    ctrl.suggestedMoves = GameModel.suggestedMoves;
  }

  function startTurn()       { GameService.startTurn(gameId); }
  function endGame()         { GameService.endGame(gameId);   }
  function restart()         { GameService.restart();         }
  function isDone()   { return GameService.isDone();          }
  function imDone()          { GameService.imDone(gameId);    }
  function pause()           { GameService.pause(gameId);     }

  function updateBoard() {
    if (ctrl.game && ctrl.game.fen && ChessValidator.game) {
      Session.set('turnIndex', ctrl.game.turnIndex);
      GameService.updateBoard();
    }
  }

  function singleMove(e, notation) {
    GameService.singleMove(notation);
  }

}
