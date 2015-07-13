angular.module('blockchess.util.common', [])
.service('CommonService', CommonService)

function CommonService($mdToast) {
    
  return {
    toast: toast
  }

  function toast(msg) {
    $mdToast.show($mdToast.simple().content(msg));
  }

}