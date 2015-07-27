angular.module('blockchess.game.timer', [])
.directive('timer', timer);

function timer() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/game/timer/timer.ng.html",
    controller: timerController,
    restrict: 'E',
    scope: { settings: '=' }
  }
}

function timerController($scope) {
  var ctrl = this;
  angular.extend(ctrl, {
    timeLeftPercentage: 100
  });

  $scope.$watch('ctrl.settings.timeLeft', updateTime);

  function updateTime() {
    if (ctrl.settings)
        ctrl.timeLeftPercentage = Math.round((ctrl.settings.timeLeft / ctrl.settings.timePerMove) * 100);
  }

}
