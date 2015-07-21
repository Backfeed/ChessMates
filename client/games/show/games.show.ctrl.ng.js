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
    game: {}
  });

  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GamesService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard, true);

  init();

  function init() {
    GamesModel.set(gameId);
    ctrl.game = GamesModel.game;
  }

  function startTurn()       { GamesService.startTurn(gameId); }
  function endGame()         { GamesService.endGame(gameId);   }
  function restart()         { GamesService.restart();         }
  function isDone()   { return GamesService.isDone();          }
  function imDone()          { GamesService.imDone(gameId);    }
  function pause()           { GamesService.pause(gameId);     }

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
