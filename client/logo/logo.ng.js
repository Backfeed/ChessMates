angular.module('blockchess.logo', [])
.directive('logo', logo);

function logo() {
  return {
    templateUrl: 'client/logo/logo.ng.html',
    scope: {}
  }
}