angular.module('blockchess.users', [])
.service('Users', Users);

function Users() {

  var service = {
    get: get,
    isLogged: isLogged,
    isAdmin: isAdmin
  };

  return service;

  function get() {
    return Meteor.user();
  }

  function isLogged() {
    return !!Meteor.userId();
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