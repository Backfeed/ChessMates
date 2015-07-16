angular.module('blockchess.util.displayNameById', [])
.filter('displayNameById', displayNameById);

function displayNameById($filter) {
  return function (id) {
    return $filter('displayName')(Meteor.users.findOne(id));
  }
}