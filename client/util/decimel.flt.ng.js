angular.module('blockchess.util.decimel', [])
.filter('decimel', decimelFilter);

function decimelFilter() {
  return function(n, l) {
    return decimel(l, n);
  }
}