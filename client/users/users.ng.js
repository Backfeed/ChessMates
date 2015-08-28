angular.module('blockchess.users', [])
.service('Users', Users);

function Users($rootScope) {

  var service = {
    get: get,
    getId: getId,
    isLogged: isLogged,
    isOwnerOrAdmin: isOwnerOrAdmin,
    isOwner: isOwner,
    isAdmin: isAdmin
  };

  return service;

  function get() {
    return $rootScope.currentUser;
  }

  function getId() {
    return get() ? get()._id : null;
  }

  function isLogged() {
    return !!get();
  }

  function isOwner(item) {
    return item.ownerId === getId();
  }

  function isAdmin() {
    return isLogged() && _.contains(getRoles(), "admin");
  }

  function getRoles() {
    if (!isLogged())
      return ;
    return Roles.getRolesForUser(getId());
  }

  function isOwnerOrAdmin(item) {
    return isOwner(item) || isAdmin();
  }

}