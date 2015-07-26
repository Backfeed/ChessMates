angular.module('blockchess.clans.config', [])
.config(clansRoutes);

function clansRoutes($stateProvider) {
  $stateProvider
    .state('clans', {
      url: '/clans',
      templateUrl: 'client/clans/clans.ng.html',
      controller: 'ClansController',
      controllerAs: 'ctrl'
    });
}