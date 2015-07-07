
angular.module('blockchess.utilities.timeAgo', [])
.directive('timeAgo', timeAgo)

function timeAgo() {
  return {
    template: "<span>{{ text }}</span>",
    scope: { timeAgo: '='},
    controller: function ($scope, $interval) {
      var interval = $interval(updateText, 1000 * 30);
      $scope.$on('destroy', destroyInterval);
      updateText();

      function destroyInterval() {
        $interval.cancel(interval);
      }

      function updateText() {
        $scope.text = moment(parseInt($scope.timeAgo)).fromNow();
      }
    }
  }
}