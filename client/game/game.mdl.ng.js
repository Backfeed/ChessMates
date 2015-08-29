angular.module('blockchess.game.model', [])
.service('GameModel', GameModel);

var log = _DEV.log('GAME MODEL');

function GameModel($rootScope, $meteor, $q, ChessValidator) {
  var $scope = $rootScope.$new();
  
  var model = {
    init: init,
    game: {}
  };

  return model;

  function init(gameId) {
    ChessValidator.init(gameId);
    var gamesSubPromise = $scope.$meteorSubscribe('games', gameId)
    model.game[gameId] = $scope.$meteorObject(Games, { _id: gameId }, false);

    return $q.all({
      games: gamesSubPromise
    }).then(function(res) {
      return res;
    });
  }

}