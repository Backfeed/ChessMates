angular.module('blockchess.game.players', [])
.directive('players', players);

function players() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'client/game/players/players.ng.html',
    controller: playersController,
    scope: { gameId: '=' }
  };
}

function playersController($scope, $meteor, GameService, GameModel) {
  var ctrl = this;
  angular.extend(ctrl, {
    isDone: isDone,
    sumBy: sumBy,
    totalReputation: 0,
    totalTokens: 0,
    totalDone: 0,
    game: {},
    players: []
  });

  $scope.$watch('ctrl.game.playedThisTurn', updateTotalDone);

  init();

  function init() {
    getPlayers();
    getGame();
  }

  function getPlayers() {
    ctrl.players = $meteor.collection(function() {
      return F.getUsersBy({ 'status.online': true });
    }, false).subscribe('userStatus');
  }

  function isDone(id) {
    return GameService.isDone(ctrl.gameId, id);
  }

  function sumBy(prop) {
    return F.sumBy(prop, ctrl.players);
  }

  function getGame() {
    ctrl.game = GameModel.game[ctrl.gameId];
  }

  function updateTotalDone(uids) {
    if (!uids) return;
    ctrl.doneCount = uids.length;
  }

}