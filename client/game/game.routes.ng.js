angular.module('blockchess.game.routes', [])
.config(gameRoutes);

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
  console.log('foo');
  return GameModel.init($stateParams.id)
          .then(function(response) {
            return response;
          });
}