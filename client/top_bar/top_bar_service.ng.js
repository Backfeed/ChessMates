angular.module('blockchess.topBar.service', [])
.service('TopBar', TopBar);

var log = _DEV.log('TOPBAR SERVICE');

function TopBar($rootScope) {
  var service = {
    
    setDynamicMenu: setDynamicMenu,
    addDynamicMenuItem: addDynamicMenuItem,
    setDynamicTitle: setDynamicTitle,
    setDynamicText: setDynamicText,
    dynamicTitle: null,
    dynamicText: null,
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

  function setDynamicText(text) {
    service.dynamicText = text;
  }

  function resetDynamic() {
    service.dynamicItems = [];
    service.dynamicTitle = null;
    service.dynamicText = null;
  }

}