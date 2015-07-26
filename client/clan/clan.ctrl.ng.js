angular.module('blockchess.clans.controller', [])
.controller('ClanController', ClanController);

function ClanController($meteor, $state) {
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