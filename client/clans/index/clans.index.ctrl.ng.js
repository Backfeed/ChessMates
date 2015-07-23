angular.module('blockchess.clans.indexController', [])
.controller('ClansIndexController', ClansIndexController);

function ClansIndexController($meteor) {
  var ctrl = this;

  angular.extend(ctrl, {
    clans: []
  });

  init();



  function init() {
    ctrl.clans = $meteor.collection(Clans).subscribe('clans');
  }

}