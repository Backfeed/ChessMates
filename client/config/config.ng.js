angular.module("blockchess.config", [
  'blockchess.config.routes',
  'blockchess.config.icons'
])

.run(function($rootScope, $state) {
  $rootScope.$state = $state;
});