angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($scope, $window, $meteor, CommonService, Engine, GamesService, GamesModel, EvaluationModel, BoardService, GameBoardService) {
  var gameId = "1"; // TODO: Get dynamically from current game
  var ctrl = this;

  angular.extend(ctrl, {
    evaluate: evaluate, // DEV ONLY
    GamesModel: GamesModel, // DEV ONLY
    startTurn: startTurn, // DEV ONLY
    pause: pause, // DEV ONLY
    BoardService: BoardService, // DEV ONLY
    GameBoardService: GameBoardService, // DEV ONLY
    endGame: endGame, // DEV ONLY
    restart: restart, // DEV ONLY
    gameId : gameId, // DEV ONLY
    imDone: imDone,
    users: [],
    userIsDone: userIsDone,
    usersList: [],
    selectedMove  : {},
    game: {}
  });

  //TODO why not inject a service here? could we avoid broadcasting data to the whole app?
  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GamesService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard);
  $scope.$watch('ctrl.users', updateUsers);

  init();

  function init() {
    GamesModel.set(gameId);
    ctrl.game = GamesModel.game;
    ctrl.users = Meteor.users.find({ "status.online": true });
    whosTurnStream.on('turnChanged', startTurnCB);
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
    ctrl.users.forEach(function(user) {
      ctrl.usersList.push(user);
    });
  }

  function startTurn() { GamesService.startTurn(gameId); };
  function pause() { GamesService.pause(gameId); };
  function endGame() { GamesService.endGame(gameId); };
  function imDone() { GamesService.imDone(gameId); };
  function startTurnCB(turn) { GamesService.startTurnCB(turn); }

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