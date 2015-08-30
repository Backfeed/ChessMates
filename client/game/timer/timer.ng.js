angular.module('blockchess.game.timer', [])
.directive('timer', timer);

var log = _DEV.log('TIMER');

function timer() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/timer/timer.ng.html",
    controller: timerController,
    restrict: 'E',
    scope: { timePerMove: '=', timeMoveStarted: '=', isGameInPlay: '=' }
  }
}

function timerController($scope, $interval) {
  var ctrl = this;
  angular.extend(ctrl, {
    timeLeftPercentage: 100
  });

  var interval = $interval(updateTime, 1000);

  $scope.$on('destroy', function() {
    $interval.cancel(interval);
  });

  function updateTime() {
    if (! ctrl.isGameInPlay) return;
    
    ctrl.timeLeft = (getTimeLeft());
    ctrl.timeLeftPercentage = F.toPercent(ctrl.timePerMove, ctrl.timeLeft);
  }

  function getDiff() {
    return Date.now() - ctrl.timeMoveStarted;
  }

  function getTimeLeft() {
    return ctrl.timePerMove - getDiff();
  }

}
