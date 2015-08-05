angular.module('blockchess.util.decimel', [])
.filter('decimel', decimelFilter);

function decimelFilter() {
  return decimel;
}