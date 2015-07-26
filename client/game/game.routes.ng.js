angular.module('blockchess.game.routes', [])
.config(gameRoutes)

function gameRoutes($stateProvider) {
  $stateProvider
    .state('game', {
      url: '/games/:id',
      templateUrl: 'client/game/game.ng.html',
      controller: 'GameController',
      controllerAs: 'ctrl'
    });

}