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
        gamePromises: initGameModel,
        sugMovePromise: initSugMoveModel
      }
    });

}

// These resolve are a bit weird 
// We don't care about the return value, which is the subscription handle returned from angular meteor subscribe
// We do this to make sure the controller can safety get the data from the models
function initGameModel(GameModel, $stateParams) {
  return GameModel.init($stateParams.id)
          .then(function(response) {
            return response;
          });
}

function initSugMoveModel(SugMovService, $stateParams) {
  return SugMovService.init($stateParams.id)
          .then(function(response) {
            return response;
          });
}

