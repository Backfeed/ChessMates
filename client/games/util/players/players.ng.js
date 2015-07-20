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

function playersController($meteor, GamesService, EvaluationModel) {
  var ctrl = this;
  angular.extend(ctrl, {
    isFavorited: isFavorited,
    isDone: isDone,
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

  function isDone(id) {
    return GamesService.isDone(id);
  }

  function isFavorited(id) {
    return !!EvaluationModel.getFavoriteByUser(id);
  }

}