angular.module('blockchess.clans.showController', [])
.controller('ClansShowController', ClansShowController);

function ClansShowController() {
  var clanId = $state.params.id;
  var ctrl = this;

  angular.extend(ctrl, {

  });

  init();

  function init() {

  }

}