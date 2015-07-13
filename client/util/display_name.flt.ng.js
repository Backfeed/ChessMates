angular.module('blockchess.util.displayName', [])
.filter('displayName', displayName);

function displayName() {
  return function (user) {
    if (!user)
      return;
    if (user.profile && user.profile.name)
      return user.profile.name;
    else if (user.emails)
      return user.emails[0].address;
    else
      return user;
  }
}
