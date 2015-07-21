angular.module('blockchess.clans.config', [])
.config(clansRoutes);

function clansRoutes($stateProvider) {
  $stateProvider
    .state('clans', {
      url: '/clans',
      templateUrl: 'client/clans/index/clans.index.ng.html',
      controller: 'ClansIndexController',
      controllerAs: 'ctrl'
    })
    .state('clan', {
      url: '/clans/:id',
      templateUrl: 'client/clans/show/clans.show.ng.html',
      controller: 'ClansShowController',
      controllerAs: 'ctrl'
    })

}