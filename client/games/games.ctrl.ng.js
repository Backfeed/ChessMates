angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($scope, $meteor, $state) {
  var ctrl = this;

  angular.extend(ctrl, {
    create: create,
    destroy: destroy,
    newGame: { title: '' },
    games: []
  });

  init();

  function init() {
    ctrl.games = $scope.$meteorCollection(Games).subscribe('gamesList');
  }

  function create() {   
    $meteor.call('createGame', ctrl.newGame.title).then(function(newGameId) {
      ctrl.newGame.title = '';
      $state.go('game', { id: newGameId });
    });
  }

  function destroy(gameId) {
    $meteor.call('destroyGame', gameId);
  }



}