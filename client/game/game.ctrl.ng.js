angular.module('blockchess.game.controller', [])
.controller('GameController', GameController)

function GameController($meteor, $state, $timeout, $scope, $rootScope, GameService, GameModel, ChessBoard, ChessValidator, Toast) {
  var gameId = $state.params.id;
  var ctrl = this;

  angular.extend(ctrl, {
    ChessValidator: ChessValidator, // DEV
    ChessBoard: ChessBoard, // DEV
    GameModel: GameModel, // DEV
    restart: restart, // DEV
    gameId: gameId, // DEV
    isDone: isDone,
    imDone: imDone,
    selectedMove: {},
    timer: {},
    user: Meteor.user(),
    game: {}
  });

  $scope.$on('singleMove::'+gameId, singleMove);
  $scope.$watch('ctrl.selectedMove', GameService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard, true);
  $scope.$watch('ctrl.game.turnIndex', checkIsGameOver);
  $scope.$watch('ctrl.game.winner', declareWinner);

  init();

  function init() {
    GameModel.init(gameId);
    ChessValidator.init(gameId);
    ctrl.game = GameModel.game[gameId];
    ctrl.timer = GameModel.timer[gameId];
    ctrl.suggestedMoves = $scope.$meteorCollection(SuggestedMoves);
    addMenuItems();

    $meteor.autorun($scope, function() {
      $scope.$meteorSubscribe('suggestedMoves', gameId, $scope.getReactively('ctrl.game.turnIndex'));
    });

    $timeout(updateBoard, 1000);
  }

  function addMenuItems() {
    $rootScope.menuItems = [];

    $timeout(function() {
      if ($rootScope.currentUser) {
        addUserMenu();
      }
      if ($rootScope.currentUser && $rootScope.currentUser.admin)
        addAdminMenu();
    }, 3000);
  }

  function addUserMenu() {
    $rootScope.menuItems.push({
      label: 'I\'m done',
      click: imDone,
      isDisabled: isDone
    });
  }

  function addAdminMenu() {
    $rootScope.menuItems.push({
      label: 'End turn',
      click: endTurn
    });
    $rootScope.menuItems.push({
      label: 'Restart',
      click: restart
    });
  }


  function restart() { GameService.restart(gameId);          }
  function isDone()  { return GameService.isDone(gameId);    }
  function imDone()  { GameService.imDone(gameId);     }
  function endTurn() { $meteor.call('endTurn', gameId); }

  function updateBoard() {
    if (ctrl.game && ctrl.game.fen && ChessValidator.game[gameId] && ChessBoard.board[gameId]) {
      GameService.updateBoard(gameId);
    }
  }

  function singleMove(e, notation) {
    GameService.movePieceBack(gameId);
    if (GameService.getSugMoveBy(ctrl.suggestedMoves, 'notation', notation)) {
      Toast.toast('move exists');
      ctrl.selectedMove = GameService.getSugMoveBy(ctrl.suggestedMoves, 'notation', notation);
      return false;
    }
    GameService.singleMove(gameId, notation);
  }

  function checkIsGameOver() {
    if (ChessValidator.game[gameId].game_over())
      Toast.toast('Game over!');
  }

  function declareWinner(winner) {
    if (!winner) return;
    Toast.toast(winner + " is the winner!");
  }

}
