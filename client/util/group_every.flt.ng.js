angular.module('blockchess.util.groupEvery', [])
.filter('groupEvery', GroupEvery);

function GroupEvery() {
  return function(arr, size, separator) {
    if (!arr || !arr.length) return null;
    return chunk(arr, size, separator);
  }
}


function chunk(arr, size, separator) {
  var newArr = [];
  for (var i=0; i<arr.length; i+=size) {
    newArr.push(arr.slice(i, i+size).join(separator));
  }
  return newArr;
}