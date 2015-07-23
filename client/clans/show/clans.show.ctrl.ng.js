angular.module('blockchess.clans.showController', [])
.controller('ClansShowController', ClansShowController);

function ClansShowController($meteor, $state) {
  var clanId = $state.params.id;
  var ctrl = this;

  angular.extend(ctrl, {
    clan: {}
  });

  init();

  function init() {
    ctrl.clan = $meteor.object(Clans, { _id: $state.params.id }).subscribe('clans');
  }

}