angular.module('blockchess.games.config', [])
.config(gamesRoutes)

function gamesRoutes($stateProvider) {
  $stateProvider
    .state('games', {
      url: '/games',
      templateUrl: 'client/games/index/games.index.ng.html',
      controller: 'GamesIndexController',
      controllerAs: 'ctrl'
    })
    .state('game', {
      url: '/games/:id',
      templateUrl: 'client/games/show/games.show.ng.html',
      controller: 'GamesShowController',
      controllerAs: 'ctrl'
    })

}