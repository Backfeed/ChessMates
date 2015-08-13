angular.module('blockchess.util.reverse', [])
.filter('reverse', Reverse);

function Reverse() {
  return function(arr) {
    if (!arr || !arr.length) return null;
    return R.reverse(arr);
  }
}