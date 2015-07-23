angular.module('blockchess.clans.createController', [])
.controller('ClansCreateController', ClansCreateController);

function ClansCreateController($meteor) {
  var ctrl = this;

  angular.extend(ctrl, {
    create: create
  });

  function create() {
    console.log('create!');
  }

}