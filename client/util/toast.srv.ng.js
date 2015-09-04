angular.module('blockchess.util.common', [])
.service('Toast', Toast)

function Toast($mdToast) {
    
  return {

    toast: toast

  }

  function toast(msg) {

    $mdToast.show($mdToast.simple().content(msg));
    
  }

}