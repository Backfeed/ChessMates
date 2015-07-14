angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($scope, GamesService, GamesModel, BoardService, GameBoardService) {
  var gameId = "1"; // TODO: Get dynamically from current game
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
    selectedMove: {},
    imDone: imDone,
    game: {}
  });

  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GamesService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard);
  whosTurnStream.on('turnChanged', startTurnCB);

  init();

  function init() {
    GamesModel.set(gameId);
    ctrl.game = GamesModel.game;
  }

  function startTurnCB(turn) { GamesService.startTurnCB(turn); }
  function moveAI(move)      { GamesService.moveAI(move); }
  function moveClan(move)    { GamesService.moveClan(move); }
  function startTurn()       { GamesService.startTurn(gameId); }
  function endGame()         { GamesService.endGame(gameId);   }
  function restart()         { GamesService.restart();         }
  function imDone()          { GamesService.imDone(gameId);    }
  function pause()           { GamesService.pause(gameId);     }

  function updateBoard() {
    if (ctrl.game.fen && GameBoardService.game) {
      GamesService.updateBoard();
    }
  }

  // DEV
  //function evaluate() {
  //  Engine.evaluate(GameBoardService.getHistory()).then(function(score) {
  //    console.log('score is ', score);
  //  })
  //}

  function singleMove(e, notation) {
    GamesService.singleMove(e, notation)
    .then(function(selectedMove) {
      ctrl.selectedMove = selectedMove;
    });
  }

}
