angular.module('blockchess.utilities.timer', [])
.directive('timer', timer)

function timer() {
  return {
    templateUrl: "client/utilities/timer/timer.ng.html",
    controller: timerController,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {}
  }
}

function timerController($scope, $interval, TIME_PER_MOVE) {
  var ctrl = this;
  angular.extend(ctrl, {
    timeLeft: TIME_PER_MOVE,
    timeLeftPercentage: 100
  });

  init();

  function init() {
    var timerInterval = $interval(function(){
      ctrl.timeLeft -= 1000;
    }, 1000);
  }

  $scope.$on('destroy', function(){
    $interval.cancel(timerInterval);
  })

  $scope.$watch('timeLeft', function(){
    ctrl.timeLeftPercentage = Math.round( (ctrl.timeLeft / TIME_PER_MOVE)  * 100 );
  });

  // TODO : Bind to game.turns array and setup watcher to that model
  $scope.$on('moveMade', function(){
    ctrl.timeLeft = TIME_PER_MOVE;
  });

}