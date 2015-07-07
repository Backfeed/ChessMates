angular.module('blockchess.utilities.timer', [])
  .directive('timer', timer);

function timer() {
  return {
    restrict: 'E',
    templateUrl: "client/utilities/timer/timer.ng.html",
    controller: timerController,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      time: '=',
      settings: '='
    }
  }
}

function timerController($scope) {
  var ctrl = this;
  angular.extend(ctrl, {
    timeLeft: 0,
    timeLeftPercentage: 100
  });

  $scope.$watch('ctrl.timeLeft', function(){
    if (ctrl.settings) {
      ctrl.timeLeftPercentage = Math.round((ctrl.timeLeft / ctrl.settings.timePerMove) * 100);
    }
  });

  $scope.$watch('ctrl.time', function(){
    if (ctrl.time) {
      ctrl.timeLeft = ctrl.time;
    }
  });

}
