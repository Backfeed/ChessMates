angular.module('blockchess.utilities.suggestMoveModal', [])
.controller('suggestMoveModalController', suggestMoveModalController);

function suggestMoveModalController($mdDialog, CommonService) {
  var ctrl = this;

  angular.extend(ctrl, {
    submit: submit,
    cancel: cancel
  });

  whosTurnStream.on('turnChanged', turnChanged);

  function submit() {
    $mdDialog.hide(ctrl.stars);
  }

  function cancel(msg) {
    msg = msg || 'user canceled';
    $mdDialog.cancel(msg);
  }

  function turnChanged() {
    CommonService.toast("Time's up!");
    cancel("time ended");
  }
}
