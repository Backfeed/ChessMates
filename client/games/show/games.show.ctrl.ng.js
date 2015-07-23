angular.module('blockchess.games.showController', [])
.controller('GamesShowController', GamesShowController)

function GamesShowController($scope, $state, GamesService, GamesModel, BoardService, GameBoardService) {
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
    game: {}
  });

  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GamesService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard, true);
  $scope.$watch('ctrl.game.move', onMove);
  $scope.$watch('ctrl.game.restarted', onRestart);

  init();

  function init() {
    GamesModel.set(gameId);
    ctrl.game = GamesModel.game;
    ctrl.timer = GamesModel.timer;
  }

  function startTurn()       { GamesService.startTurn(gameId); }
  function endGame()         { GamesService.endGame(gameId);   }
  function restart()         { GamesService.restart();         }
  function isDone()   { return GamesService.isDone();          }
  function imDone()          { GamesService.imDone(gameId);    }
  function pause()           { GamesService.pause(gameId);     }

  function onRestart() {
    if (ctrl.game && ctrl.game.restarted) {
      GamesService.onRestart();
    }
  }

  function onMove() {
    if (ctrl.game && ctrl.game.turn) {
      GamesService.onMove(_.last(ctrl.game.moves), ctrl.game.turn);
    }
  }

  function updateBoard() {
    if (ctrl.game.fen && GameBoardService.game) {
      GamesService.updateBoard();
    }
  }

  function singleMove(e, notation) {
    GamesService.singleMove(e, notation)
    .then(function(selectedMove) {
      ctrl.selectedMove = selectedMove;
    });
  }

}
