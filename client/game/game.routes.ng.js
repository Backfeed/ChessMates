angular.module('blockchess.game.routes', [])
.config(gameRoutes);

var log = _DEV.log('GAME ROUTE')

function gameRoutes($stateProvider) {
  $stateProvider
    .state('game', {
      url: '/games/:id',
      templateUrl: 'client/game/game.ng.html',
      controller: 'GameController',
      controllerAs: 'ctrl',
      resolve: {
        gamePromises: getGameData
      }
    });

}

function getGameData(GameModel, $stateParams) {
  return GameModel.init($stateParams.id)
          .then(function(response) {
            return response;
          });
}