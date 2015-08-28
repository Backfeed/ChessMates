angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($meteor, $state) {
  var ctrl = this;

  angular.extend(ctrl, {
    create: create,
    destroy: destroy,
    newGame: { title: '' },
    games: []
  });

  init();

  function init() {
    ctrl.games = $meteor.collection(Games).subscribe('gamesList');
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