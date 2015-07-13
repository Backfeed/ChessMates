angular.module('blockchess.games.util.players', [])
.directive('players', players);

function players() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'client/games/util/players/players.ng.html',
    controller: playersController,
    scope: {}
  };
}

function playersController($meteor, GamesService) {
  var ctrl = this;
  angular.extend(ctrl, {
    userIsDone: userIsDone,
    usersList: [],
    users: []
  });

  $meteor.subscribe('userStatus');
  connectionStream.on('connections', updateUsers);

  init();

  function init() {
    updateUsers();
  }

  function updateUsers() {
    ctrl.usersList = [];
    ctrl.users = Meteor.users.find({ "status.online": true });
    ctrl.users.forEach(function(user) {
      ctrl.usersList.push(user);
    });
  }

  function userIsDone(id) {
    return GamesService.userIsDone(id);
  }
}