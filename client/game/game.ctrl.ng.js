angular.module('blockchess.game.controller', [])
.controller('GameController', GameController)

function GameController($scope, $rootScope, GameService, GameModel, ChessBoard, ChessValidator, Toast) {
  var gameId = "1";
  var ctrl = this;

  angular.extend(ctrl, {
    ChessValidator: ChessValidator, // DEV
    ChessBoard: ChessBoard, // DEV
    GameModel: GameModel, // DEV
    restart: restart, // DEV
    gameId: gameId, // DEV
    isDone: isDone,
    imDone: imDone,
    showRawData: showRawData,
    selectedMove: {},
    timer: {},
    user: Meteor.user(),
    game: {}
  });

  Session.set('showRawData', false);

  $scope.$on('singleMove', singleMove);
  $scope.$watch('ctrl.selectedMove', GameService.selectedMoveChanged);
  $scope.$watch('ctrl.game.fen', updateBoard, true);
  $scope.$watch('ctrl.game.turnIndex', checkIsGameOver);
  $scope.$watch('ctrl.game.winner', declareWinner);

  init();

  function init() {
    GameModel.set(gameId);
    ctrl.game = GameModel.game;
    ctrl.timer = GameModel.timer;
    ctrl.suggestedMoves = GameModel.suggestedMoves;

    $rootScope.menuItems = [
      {
        label: 'I\'m done',
        click: imDone,
        isDisabled: isDone
      }
    ]

    if (Meteor.user() && Meteor.user().admin)
      addAdminMenu();
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

  function restart() { GameService.restart();          }
  function isDone()  { return GameService.isDone();    }
  function imDone()  { GameService.imDone(gameId);     }
  function endTurn() { Meteor.call('endTurn', gameId); }

  function updateBoard() {
    if (ctrl.game && ctrl.game.fen && ChessValidator.game) {
      Session.set('turnIndex', ctrl.game.turnIndex);
      GameService.updateBoard();
    }
  }

  function showRawData() {
    return Session.get('showRawData');
  }

  function singleMove(e, notation) {
    GameService.movePieceBack();
    if (GameService.getMoveBy('notation', notation)) {
      Toast.toast('move exists');
      ctrl.selectedMove = GameService.getMoveBy('notation', notation);
      return false;
    }
    GameService.singleMove(notation);
  }

  function checkIsGameOver() {
    if (ChessValidator.game.game_over())
      Toast.toast('Game over!');
  }

  function declareWinner(winner) {
    if (!winner) return;
    Toast.toast(winner + " is the winner!");
  }

}
