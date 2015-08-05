angular.module('blockchess.game.players', [])
.directive('players', players);

function players() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'client/game/players/players.ng.html',
    controller: playersController,
    scope: { game: '='}
  };
}

function playersController($scope, $meteor, GameService, EvaluationModel) {
  var ctrl = this;
  angular.extend(ctrl, {
    isDone: isDone,
    totalReputation: 0,
    totalTokens: 0,
    totalDone: 0,
    usersList: [],
    users: []
  });

  $scope.$watch('ctrl.game.playedThisTurn', updateTotalDone);

  init();

  function init() {
    $meteor.subscribe('userStatus');
    updateUsers();
  }

  function updateUsers() {
    resetStats();
    ctrl.usersList = [];
    // TODO :: Remove users, only usersList shall prevail
    _.each(getUsersBy({ "status.online": true }), function(user) {
      ctrl.usersList.push(user);
      addToTotalFrom(user);
    });
  }

  function resetStats() {
    ctrl.totalReputation = 0;
    ctrl.totalTokens = 0;
  }

  function addToTotalFrom(user) {
    ctrl.totalReputation += user.reputation;
    ctrl.totalTokens += user.tokens;
  }

  function isDone(id) {
    return GameService.isDone(id);
  }

  function updateTotalDone(ids) {
    if (!ids) { return 0; }
    ctrl.totalDone = ids.length;
  }

}