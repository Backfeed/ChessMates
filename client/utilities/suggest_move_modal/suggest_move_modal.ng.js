angular.module('blockchess.utilities.suggestMoveModal', [])
.controller('suggestMoveModalController', suggestMoveModalController);

function suggestMoveModalController($mdDialog) {
  var ctrl = this;
  angular.extend(ctrl, {
    submit: submit,
    cancel: cancel
  });

  function submit() {
    $mdDialog.hide(ctrl.stars);
  }

  function cancel() {
    $mdDialog.cancel('user canceled');
  }
}
