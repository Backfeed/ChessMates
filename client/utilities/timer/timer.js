angular.module('blockchess.utilities.timer', [])
.directive('timer', timer)

function timer() {
  return {
    templateUrl: "client/utilities/timer/timer.ng.html",
    controller: timerController,
    scope: {}
  }
}

function timerController($scope, $interval, TIME_PER_MOVE) {
  angular.extend($scope, {
    timeLeft: TIME_PER_MOVE,
    timeLeftPercentage: 100
  });

  init();

  function init() {
    var timerInterval = $interval(function(){
      $scope.timeLeft -= 1000;
    }, 1000);
  }

  $scope.$on('destroy', function(){
    $interval.cancel(timerInterval);
  })

  $scope.$watch('timeLeft', function(){
    $scope.timeLeftPercentage = Math.round( ($scope.timeLeft / TIME_PER_MOVE)  * 100 );
    console.log($('.timer md-progress-circular:before'))
  });

  $scope.$on('moveMade', function(){
    $scope.timeLeft = TIME_PER_MOVE;
  });

}
