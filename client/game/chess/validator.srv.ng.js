angular.module('blockchess.game.chess.validator', [])
.service('ChessValidator', ChessValidator);

function ChessValidator($window) {
  var service = {
    init: init,
    game: {}
  };

  return service;

  function init(gameId) {
    service.game[gameId] = new $window.Chess();
  }

}