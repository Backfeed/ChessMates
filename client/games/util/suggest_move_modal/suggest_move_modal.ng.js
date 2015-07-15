angular.module('blockchess.games.util.suggestMoveModal', [])
.controller('suggestMoveModalController', suggestMoveModalController);

function suggestMoveModalController($mdDialog, CommonService) {
  var ctrl = this;

  angular.extend(ctrl, {
    submit: submit,
    cancel: cancel
  });

  movesStream.on('move', turnChanged);

  function submit() {
    $mdDialog.hide(ctrl.stars);
  }

  function cancel(msg) {
    msg = msg || 'user canceled';
    $mdDialog.cancel(msg);
  }

  function turnChanged(move, turn) {
    CommonService.toast("Time's up!");
    cancel("time ended for this turn!");
  }
}
