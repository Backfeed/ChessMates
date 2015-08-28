angular.module('blockchess.users', [])
.service('Users', Users);

function Users() {
  var service = {
    isLogged: isLogged,
    isAdmin: isAdmin
  };

  return service;

  function isLogged() {
    return !!getId();
  }

  function isAdmin() {
    return isLogged() && _.contains(getRoles(), "admin");
  }

  function getRoles() {
    return Roles.getRolesForUser(getId());
  }

  function getId() {
    return Meteor.userId();
  }
}