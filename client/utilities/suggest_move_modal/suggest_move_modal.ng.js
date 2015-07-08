angular.module('blockchess.utilities.suggestMoveModal', [])
.controller('suggestMoveModalController', suggestMoveModalController);

function suggestMoveModalController($mdDialog) {
  var ctrl = this;
  angular.extend(ctrl, {
    submit: submit,
    cancel: cancel
  });

  function submit() { 
    if (ctrl.form.$valid) { $mdDialog.hide(ctrl.evaluation); } 
    else                  { ctrl.form.$setSubmitted();       }
  }

  function cancel() {
    $mdDialog.cancel('user canceled');
  }
}