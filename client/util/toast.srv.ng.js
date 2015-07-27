angular.module('blockchess.util.common', [])
.service('ToastService', ToastService)

function ToastService($mdToast) {
    
  return {
    toast: toast
  }

  function toast(msg) {
    $mdToast.show($mdToast.simple().content(msg));
  }

}