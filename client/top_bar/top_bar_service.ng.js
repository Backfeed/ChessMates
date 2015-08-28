angular.module('blockchess.topBar.service', [])
.service('TopBar', TopBar);

function TopBar($rootScope) {
  var service = {
    
    set: set,
    addDynamic: addDynamic,
    dynamicItems: []

  };

  $rootScope.$on('$stateChangeStart', resetDynamic);

  return service;

  function set(items) {
    service.dynamicItems = items;
  }

  function addDynamic(item) {
    service.dynamicItems.push(item);
  }


  function resetDynamic() {
    service.dynamicItems = [];
  }

}