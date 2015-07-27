angular.module('blockchess.clan.routes', [])
.config(clanRoutes);

function clanRoutes($stateProvider) {
  $stateProvider
    .state('clan', {
      url: '/clans/:id',
      templateUrl: 'client/clan/clan.ng.html',
      controller: 'ClanController',
      controllerAs: 'ctrl'
    });
}
