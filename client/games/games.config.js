angular.module('blockchess.games.config', [])
.config(config)

function config($stateProvider){
  $stateProvider
    .state('games', {
      url: '/games',
      templateUrl: 'client/games/games.ng.html',
      controller: 'GamesController'
    });
}