angular.module('blockchess.game.controller', [])
.controller('GameController', GameController)

function GameController($scope, $state, GamesService, GamesModel, BoardService, GameBoardService) {
  var gameId = $state.params.id;
  var ctrl = this;

  angular.extend(ctrl, {
    GameBoardService: GameBoardService, // DEV
    BoardService: BoardService, // DEV
    GamesModel: GamesModel, // DEV
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
  $scope.$watch('ctrl.selectedMove', GamesService.selectedMoveChanged);
  //TODO why use 'true' here? it's a string
  $scope.$watch('ctrl.game.fen', updateBoard, true);
  $scope.$watch('ctrl.status.turn', onTurn, true);
  $scope.$watch('ctrl.status.restarted', onRestart, true);

  init();

  function init() {
    GamesModel.set(gameId);
    ctrl.game = GamesModel.game;
    ctrl.timer = GamesModel.timer;
    ctrl.status = GamesModel.status;
  }

  function startTurn()       { GamesService.startTurn(gameId); }
  function endGame()         { GamesService.endGame(gameId);   }
  function restart()         { GamesService.restart();         }
  function isDone()   { return GamesService.isDone();          }
  function imDone()          { GamesService.imDone(gameId);    }
  function pause()           { GamesService.pause(gameId);     }

  function onRestart() {
    if (ctrl.status) {
      GamesService.onRestart();
    }
  }

  function onTurn() {
    if (ctrl.status) {
      GamesService.onMove(_.last(ctrl.game.pgn), ctrl.game.turn);
    }
  }

  function updateBoard() {
    if (ctrl.game && GameBoardService.game) {
      GamesService.updateBoard();
    }
  }

  function singleMove(e, notation) {
    GamesService.singleMove(notation)
    .then(function(selectedMove) {
      ctrl.selectedMove = selectedMove;
    });
  }

}
