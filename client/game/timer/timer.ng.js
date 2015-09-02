angular.module('blockchess.game.timer', [
  'blockchess.game.timer.service'
])
.directive('timer', timer);

var log = _DEV.log('TIMER');

function timer() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/timer/timer.ng.html",
    controller: timerController,
    restrict: 'E',
    scope: { isGameInPlay: '=', gameId: '=' }
  }
}

function timerController($scope, $interval, Timer) {
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

    ctrl.timeLeft = Timer.getTurnTimeLeft(ctrl.gameId);
    ctrl.timeLeftPercentage = Timer.getTurnTimeLeftPercentage(ctrl.gameId);
  }

}