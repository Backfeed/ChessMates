angular.module('blockchess.games.util.gameBoardService', [])
.service('GameBoardService', GameBoardService);

function GameBoardService($window) {
  var GameBoard = {
    getHistory: getHistory,
    game: new $window.Chess()
  }

  return GameBoard;

  function getHistory() {
    return GameBoard.game.history({ verbose: true })
            .map(function(move){ 
              return move.from + move.to })
            .join(" ");
  }

}