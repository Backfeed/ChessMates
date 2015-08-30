angular.module('blockchess.clans.controller', [])
.controller('ClansController', ClansController);

function ClansController($meteor) {
  var ctrl = this;

  angular.extend(ctrl, {
    clans: []
  });

  init();



  function init() {
    ctrl.clans = $scope.$meteorCollection(Clans, false).subscribe('clans');
  }

}