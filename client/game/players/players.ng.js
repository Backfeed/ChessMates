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
    totalReputation: 0,
    totalFavorited: 0,
    totalTokens: 0,
    totalDone: 0,
    isFavorited: isFavorited,
    isDone: isDone,
    usersList: [],
    users: []
  });

  $scope.$watch('ctrl.game.playedThisTurn', updateTotalDone);
  $scope.$watch('ctrl.suggestedMoves', updateTotalFavorited, true);

  $meteor.subscribe('userStatus');

  init();

  function init() {
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

  function isFavorited(id) {
    return !!EvaluationModel.getFavoriteByUser(id);
  }

  function updateTotalDone(ids) {
    if (!ids) { return 0; }
    ctrl.totalDone = ids.length;
  }

  function updateTotalFavorited(suggestedMoves) {
    if (!suggestedMoves || !suggestedMoves.length) { return 0; }
    ctrl.totalFavorited = 0;
    _.each(suggestedMoves, function(sugMove) {
      _.each(sugMove.evaluations, function(evl) {
        if (evl.favoriteMove)
          ctrl.totalFavorited += 1;
      });
    });
  }

}
