angular.module('blockchess.users', [])
.service('Users', Users);

function Users($rootScope) {

  var service = {
    get: get,
    isLogged: isLogged,
    isAdmin: isAdmin
  };

  return service;

  function get() {
    return $rootScope.currentUser;
  }

  function isLogged() {
    return !!$rootScope.currentUser;
  }

  function isAdmin() {
    return isLogged() && _.contains(getRoles(), "admin");
  }

  function getRoles() {
    if (!isLogged())
      return 
    return Roles.getRolesForUser(get()._id);
  }

}