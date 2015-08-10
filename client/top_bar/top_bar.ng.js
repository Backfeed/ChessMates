angular.module('blockchess.topBar', [])
.directive('topBar', topBar);

function topBar() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'client/top_bar/top_bar.ng.html',
    controller: topBarController,
    retrict: 'E',
    scope: {}
  };
}

function topBarController($meteor) {
  var ctrl = this;
  angular.extend(ctrl, {
    clans: []
  });

  init();

  function init() {
    getClans();
  }

  function getClans() {
  }

}
