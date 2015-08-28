angular.module('blockchess.topBar.service', [])
.service('TopBar', TopBar);

var log = _DEV.log('TOPBAR SERVICE');

function TopBar($rootScope) {
  var service = {
    
    setDynamicMenu: setDynamicMenu,
    addDynamicMenuItem: addDynamicMenuItem,
    setDynamicTitle: setDynamicTitle,
    dynamicTitle: null,
    dynamicItems: []

  };

  $rootScope.$on('$stateChangeStart', resetDynamic);

  return service;

  function setDynamicMenu(items) {
    service.dynamicItems = items;
  }

  function addDynamicMenuItem(item) {
    service.dynamicItems.push(item);
  }

  function setDynamicTitle(title) {
    service.dynamicTitle = title;
  }

  function resetDynamic() {
    service.dynamicItems = [];
    service.dynamicTitle = null;
  }

}