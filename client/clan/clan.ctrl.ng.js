angular.module('blockchess.clan.controller', [])
.controller('ClanController', ClanController);

function ClanController($meteor, $state) {
  var ctrl = this;

  angular.extend(ctrl, {
    clan: {}
  });

  init();

  function init() {
    ctrl.clan = $scope.$meteorObject(Clans, { _id: $state.params.id }, false).subscribe('clans');
  }

}