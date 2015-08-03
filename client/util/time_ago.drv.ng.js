angular.module('blockchess.util.timeAgo', [])
.directive('timeAgo', timeAgo);

function timeAgo() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    controller: timeAgoCtrl,
    template: "<span>{{ ctrl.text }}</span>",
    scope: { timeAgo: '='}
  };
}

function timeAgoCtrl($scope, $interval) {
  var interval = $interval(updateText, 1000 * 30);
  var ctrl = this;
  angular.extend(ctrl, {
    text: ''
  });

  $scope.$on('destroy', destroyInterval);

  init();

  function init() {
    updateText();
  }

  function destroyInterval() { $interval.cancel(interval); }
  function updateText() { ctrl.text = moment(ctrl.timeAgo).fromNow(); }

}