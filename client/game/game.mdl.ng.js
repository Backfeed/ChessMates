angular.module('blockchess.game.model', [])
.service('GameModel', GameModel);

function GameModel($rootScope, $meteor) {
  var $scope = $rootScope.$new();
  
  var model = {
    init: init,
    game: {},
    timer: {}
  };

  return model;

  function init(gameId) {
    model.game[gameId] = $scope.$meteorObject(Games, { _id: gameId }).subscribe('games', gameId);
    model.timer[gameId] = $scope.$meteorObject(Timers, { gameId: gameId }).subscribe('timers', gameId);
  }

}

function log() {
  console.log('\n\n');
  console.log('CLIENT: MODEL: GAME: ');
  _.each(arguments, function(msg) {
    console.log(msg);
  });
  console.log('\n\n');
}