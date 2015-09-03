angular.module('blockchess.game.controller', [])
.controller('GameController', GameController)

var log = _DEV.log('GAME CTRL');

function GameController($meteor, $state, $timeout, $scope, $rootScope, Evaluation, gamePromises, Users, GameService, GameModel, ChessBoard, ChessValidator, Toast, TopBar, DesktopNotifier, SugMovService) {
  var gameId = $state.params.id;
  var ctrl = this;

  angular.extend(ctrl, {
    gameId: gameId,
    isDone: isDone,
    currnetPlayerIsDone: false,
    imDone: imDone,
    activeReputationSum: 0,
    currentTurnEvaluations: [],
    selectedMove: {},
    game: {}
  });

  $scope.$on('singleMove::'+gameId, singleMove);
  $scope.$watch('ctrl.selectedMove', GameService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard, true);
  $scope.$watch('ctrl.game.winner', declareWinner);
  $scope.$watch('ctrl.game.turnIndex', turnChanged);
  $scope.$watch('ctrl.currentTurnEvaluations', updateActiveReputationSum, true);

  init();

  function turnChanged(turnIndex, prevTurnIndex) {
    notifyNewTurn(turnIndex, prevTurnIndex);
    ctrl.currnetPlayerIsDone = false;
  }

  function notifyNewTurn(turnIndex, prevTurnIndex) {
    if (! turnIndex || turnIndex === 1 || ! prevTurnIndex || turnIndex === prevTurnIndex) return;

    GameService.notifyNewTurn(turnIndex);
  }

  function init() {
    ctrl.game = GameModel.game[gameId];
    ctrl.suggestedMoves = SugMovService.moves[gameId];
    GameService.setTopBarMenu(gameId);
    TopBar.setDynamicTitle(ctrl.game.title);
    ctrl.currnetPlayerIsDone = GameService.isDone(gameId);

    $meteor.autorun($scope, function() {
      $scope.$meteorSubscribe('suggestedMoves', gameId, $scope.getReactively('ctrl.game.turnIndex'));
      Evaluation.init(gameId, ctrl.game.turnIndex);
      ctrl.currentTurnEvaluations = Evaluation.evals[gameId];
    });

    $timeout(updateBoard, 1000);
  }

  function updateActiveReputationSum() {
    if (ctrl.currentTurnEvaluations) {
      ctrl.activeReputationSum = Protocol.calcConfidence(ctrl.currentTurnEvaluations);
    }
  }

  function imDone() { 
    GameService.imDone(gameId);
  }

  function isDone()  { return GameService.isDone(gameId);    }

  function updateBoard() {
    if (ctrl.game && ctrl.game.fen && ChessValidator.game[gameId] && ChessBoard.board[gameId]) {
      GameService.updateBoard(gameId);
    }
  }

  function singleMove(e, notation) {
    GameService.movePieceBack(gameId);
    if ( SugMovService.isMoveExists(gameId, notation) ) {
      Toast.toast('move exists');
      ctrl.selectedMove = SugMovService.getByNotation(gameId, notation);
      return false;
    }
    GameService.singleMove(gameId, notation);
  }

  function declareWinner(winner) {
    if (!winner) return;
    Toast.toast(winner + " is the winner!");
  }

}
