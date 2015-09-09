angular.module("blockchess.config", [
  'blockchess.config.routes',
  'blockchess.config.icons'
])

.run(function($rootScope, $state, $mdToast) {
  if (inDevelopment()) {
    $rootScope.$state = $state;
    $rootScope.$mdToast = $mdToast;
  }
});