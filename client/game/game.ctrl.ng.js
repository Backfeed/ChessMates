angular.module('blockchess.game.controller', [])
.controller('GameController', GameController)

var log = _DEV.log('GAME CTRL - ');

function GameController($meteor, $state, $timeout, $scope, $rootScope, gamePromises, Users, GameService, GameModel, ChessBoard, ChessValidator, Toast, TopBar) {
  var gameId = $state.params.id;
  var ctrl = this;

  angular.extend(ctrl, {
    ChessValidator: ChessValidator, // DEV
    ChessBoard: ChessBoard, // DEV
    GameModel: GameModel, // DEV
    restart: restart, // DEV
    TopBar: TopBar, // DEV
    gameId: gameId,
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
    ctrl.game = GameModel.game[gameId];
    ctrl.timer = GameModel.timer[gameId];
    ctrl.suggestedMoves = $scope.$meteorCollection(SuggestedMoves);
    setTopBarMenu();
    setTopBarTitle();

    $meteor.autorun($scope, function() {
      $scope.$meteorSubscribe('suggestedMoves', gameId, $scope.getReactively('ctrl.game.turnIndex'));
    });

    $timeout(updateBoard, 1000);
  }

  function setTopBarMenu() {
    TopBar.setDynamicMenu([
      {
        label: 'I\'m done',
        click: imDone,
        isDisabled: isDone,
        requireUser: true
      },
      {
        label: 'End turn',
        click: endTurn,
        ownerId: ctrl.game.ownerId,
        requireAdmin: true
      },
      {
        label: 'Restart',
        click: restart,
        ownerId: ctrl.game.ownerId,
        requireAdmin: true
      },
      {
        label: 'Archive',
        click: archive,
        ownerId: ctrl.game.ownerId,
        requireAdmin: true
      }
    ]);
  }

  function setTopBarTitle() {
    TopBar.setDynamicTitle(ctrl.game.title);
  }

  function restart() { GameService.restart(gameId);          }
  function archive() { GameService.archive(gameId);          }
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
