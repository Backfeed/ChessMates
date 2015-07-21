angular.module('blockchess.games.util.players', [])
.directive('players', players);

function players() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'client/games/util/players/players.ng.html',
    controller: playersController,
    scope: { game: '='}
  };
}

function playersController($scope, $meteor, GamesService, EvaluationModel) {
  var ctrl = this;
  angular.extend(ctrl, {
    totalReputation: 0,
    totalFavorited: 0,
    totalTokens: 0,
    totalDone: 0,
    isFavorited: isFavorited,
    isDone: isDone,
    usersList: [],
    users: []
  });

  $scope.$watch('ctrl.game.played_this_turn', updateTotalDone);
  $scope.$watch('ctrl.game.suggested_moves', updateTotalFavorited, true);

  $meteor.subscribe('userStatus');
  connectionStream.on('connections', updateUsers);

  init();

  function init() {
    updateUsers();
  }

  function updateUsers() {
    resetStats();
    ctrl.usersList = [];
    // TODO :: Remove users, only usersList shall prevail
    ctrl.users = Meteor.users.find({ "status.online": true });
    ctrl.users.forEach(function(user) {
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
    return GamesService.isDone(id);
  }

  function isFavorited(id) {
    return !!EvaluationModel.getFavoriteByUser(id);
  }

  function updateTotalDone(ids) {
    if (!ids) { return 0; }
    ctrl.totalDone = ids.length;
  }

  function updateTotalFavorited(suggested_moves) {
    if (!suggested_moves || !suggested_moves.length) { return 0; }
    ctrl.totalFavorited = 0;
    suggested_moves.forEach(function(sug_move) {
      sug_move.evaluations.forEach(function(evl) {
        if (evl.favorite_move) 
          ctrl.totalFavorited += 1;
      });
    });
  }

}