angular.module('blockchess.topBar', [
  'blockchess.topBar.service'
])
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

function topBarController($meteor, TopBar) {
  var ctrl = this;

  angular.extend(ctrl, {
    getDynamicItems: getDynamicItems
  });

  function getDynamicItems() {
    return TopBar.dynamicItems;
  }

}