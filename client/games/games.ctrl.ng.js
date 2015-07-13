angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($scope, $window, $meteor, CommonService, Engine, GamesService, GamesModel, EvaluationModel, BoardService, GameBoardService) {
  var gameId = "1"; // TODO: Get dynamically from current game
  var ctrl = this;

  angular.extend(ctrl, {
    evaluate: evaluate, // DEV
    GamesModel: GamesModel, // DEV
    startTurn: startTurn, // DEV
    pause: pause, // DEV
    BoardService: BoardService, // DEV
    GameBoardService: GameBoardService, // DEV
    endGame: endGame, // DEV
    restart: restart, // DEV
    gameId : gameId, // DEV
    userIsDone: userIsDone,
    imDone: imDone,
    users: [],
    selectedMove: {},
    usersList: [],
    game: {}
  });

  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GamesService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard);
  $meteor.subscribe('userStatus');
  whosTurnStream.on('turnChanged', startTurnCB);
  connectionStream.on('connections', updateUsers);

  init();

  function init() {
    GamesModel.set(gameId);
    ctrl.game = GamesModel.game;
    updateUsers();
  }

  function userIsDone(id) {
    var bool = false;
    $window.ClientsDone.forEach(function(userId) {
      if (userId === id) { return bool = true; }
    });
    return bool;
  }

  function updateUsers() {
    ctrl.usersList = [];
    ctrl.users = Meteor.users.find({ "status.online": true });
    ctrl.users.forEach(function(user) {
      ctrl.usersList.push(user);
    });
  }

  function startTurnCB(turn) { GamesService.startTurnCB(turn); }
  function startTurn()       { GamesService.startTurn(gameId); }
  function endGame()         { GamesService.endGame(gameId);   }
  function imDone()          { GamesService.imDone(gameId);    }
  function pause()           { GamesService.pause(gameId);     }

  function restart() {
    GamesService.cancelMoveHighlights();
    GameBoardService.game.reset();
    BoardService.board.position('start');
    GamesModel.restart();
    startTurn();
  }

  function updateBoard() {
    if (ctrl.game.fen && GameBoardService.game) {
      GamesService.updateBoard();
    }
  }

  // DEV
  function evaluate() {
    Engine.evaluate(GameBoardService.getHistory()).then(function(score) {
      console.log('score is ', score);
    })
  }

  function singleMove(e, notation) {
    GamesService.singleMove(e, notation)
    .then(function(selectedMove) {
      ctrl.selectedMove = selectedMove;
    });
  }

}