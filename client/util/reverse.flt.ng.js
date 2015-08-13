angular.module('blockchess.util.reverse', [])
.filter('reverse', Reverse);

function Reverse() {
  return R.reverse;
}