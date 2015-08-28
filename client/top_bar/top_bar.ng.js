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
    userCanAccess: userCanAccess
  });

  function getDynamicItems() {
    return TopBar.dynamicItems;
  }

  function userCanAccess(item) {
    if (Users.isOwner(item))
      return true;

    return !(item.requireUser && !Users.isLogged()) &&
           !(item.requireAdmin && !Users.isAdmin());
  }   

  function getDynamicTitle() {
    return TopBar.dynamicTitle;
  }

}