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

function topBarController($meteor, TopBar, Users) {
  var ctrl = this;

  angular.extend(ctrl, {
    getDynamicTitle: getDynamicTitle,
    getDynamicItems: getDynamicItems,
    getDynamicText: getDynamicText
  });

  function getDynamicItems() {
    return _.filter(TopBar.dynamicItems, Users.canAccess);
  }

  function getDynamicTitle() {
    return TopBar.dynamicTitle;
  }

  function getDynamicText() {
    return TopBar.dynamicText;
  }

  

}