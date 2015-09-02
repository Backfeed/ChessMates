angular.module('blockchess.game.timer.service', [])
.service('Timer', Timer);

function Timer(GameModel) {

  var service = {
    getTurnTimeLeft: getTurnTimeLeft,
    getTurnTimeLeftPercentage: getTurnTimeLeftPercentage
  };

  return service;

  function getTurnTimeLeft(gameId) {
    var timeLeft = getTimePerMove(gameId) - getTimeSinceTurnStarted(gameId);
    return negativeToZero(timeLeft);
  }

  function getTurnTimeLeftPercentage(gameId) {
    var percentage = F.toPercent(getTimePerMove(gameId), getTurnTimeLeft(gameId));
    return negativeToZero(percentage);
  }

  function getTimeSinceTurnStarted(gameId) {
    return Date.now() - GameModel.game[gameId].timeMoveStarted
  }

  function getTimePerMove(gameId) {
    return GameModel.game[gameId].timePerMove;
  }

  function negativeToZero(n) {
    return Math.max(n, 0);
  }

}