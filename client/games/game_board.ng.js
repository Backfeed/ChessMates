angular.module('blockchess.games.gameBoardService', [])
.service('GameBoardService', GameBoardService);

function GameBoardService($window) {
  var GameBoard = {
    game: new $window.Chess()
  }

  return GameBoard;

}