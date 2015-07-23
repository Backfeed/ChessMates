angular.module('blockchess.games.util.suggestMoveModal', [])
.controller('suggestMoveModalController', suggestMoveModalController);

function suggestMoveModalController($mdDialog, GamesService, CommonService, $scope) {
  var ctrl = this;

  angular.extend(ctrl, {
    submit: submit,
    cancel: cancel
  });

  $scope.$watch('ctrl.game.turn', turnChanged);

  function submit() {
    if (GamesService.getMoveBy('notation', ctrl.notation)) {
      CommonService.toast('move exists');
      cancel('move exists');
      GamesService.movePieceBack();
    } else {
      $mdDialog.hide(ctrl.stars);
    }
  }

  function cancel(msg) {
    msg = msg || 'user canceled';
    $mdDialog.cancel(msg);
  }

  function turnChanged(move, turn) {
    //CommonService.toast("Time's up!");
    cancel("time ended for this turn!");
  }
}
