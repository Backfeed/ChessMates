angular.module('blockchess.games.routes', [])
.config(gamesRoutes)

function gamesRoutes($stateProvider) {
  $stateProvider
    .state('games', {
      url: '/games',
      templateUrl: 'client/games/games.ng.html',
      controller: 'GamesController',
      controllerAs: 'ctrl'
    });
}