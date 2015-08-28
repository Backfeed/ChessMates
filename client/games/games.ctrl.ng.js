angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($scope, $meteor, $state, Users, Toast) {
  var ctrl = this;

  angular.extend(ctrl, {
    create: create,
    userCanDestroy: userCanDestroy,
    destroy: destroy,
    newGame: { title: '' },
    games: []
  });

  init();

  function init() {
    ctrl.games = $scope.$meteorCollection(Games).subscribe('gamesList');
  }

  function create() {   
    if (Users.isLogged()) {
      $meteor.call('createGame', ctrl.newGame.title).then(function(newGameId) {
        ctrl.newGame.title = '';
        $state.go('game', { id: newGameId });
      });
    } else {
      Toast.toast('Please log in to create a game');
    }
  }

  function destroy(gameId) {
    $meteor.call('destroyGame', gameId);
  }

  function userCanDestroy(game) {
    return game.ownerId === Users.getId() || 
           Users.isAdmin();
  }

}