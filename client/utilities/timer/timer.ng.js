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

  timerStream = new Meteor.Stream('timer');
  timerStream.on('timer', function(timeLeft) {
    //console.log('timeLeft - ', timeLeft/1000);
    ctrl.timeLeft = timeLeft;
    if (ctrl.settings)
        ctrl.timeLeftPercentage = Math.round((ctrl.timeLeft / ctrl.settings.timePerMove) * 100);
    //TODO see how to avoid using apply here, some reactivly thingy
    $scope.$apply();
  });

}
