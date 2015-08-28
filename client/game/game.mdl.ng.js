angular.module('blockchess.game.model', [])
.service('GameModel', GameModel);

var log = _DEV.log('GAME MODEL');

function GameModel($rootScope, $meteor, $q, ChessValidator) {
  var $scope = $rootScope.$new();
  
  var model = {
    init: init,
    game: {},
    timer: {}
  };

  return model;

  function init(gameId) {
    ChessValidator.init(gameId);
    var gamesSubPromise = $scope.$meteorSubscribe('games', gameId)
    var timersSubPromise = $scope.$meteorSubscribe('timers', gameId)
    model.game[gameId] = $scope.$meteorObject(Games, { _id: gameId });
    model.timer[gameId] = $scope.$meteorObject(Timers, { gameId: gameId }).subscribe('timers', gameId);

    return $q.all({
      games: gamesSubPromise,
      timers: timersSubPromise
    }).then(function(res) {
      return res;
    });
  }

}