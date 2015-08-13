angular.module('blockchess.util.displayName', [])
.filter('displayName', displayName);

function displayName() {
  return User.displayNameOf;
}