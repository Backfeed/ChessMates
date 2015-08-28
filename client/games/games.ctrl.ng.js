angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($scope, $meteor, $state, Users, Toast) {
  var ctrl = this;

  angular.extend(ctrl, {
    create: create,
    destroy: destroy,
    archive: archive,
    userCanArchive: userCanArchive,
    userCanDestroy: userCanDestroy,
    newGame: { title: '' },
    games: []
  });

  init();

  function init() {
    $meteor.autorun($scope, function() {
      ctrl.games = $scope.$meteorCollection(Games, { 
        status: { $not: /archived/ } 
      })
      .subscribe('gamesList');
    });
  }

  function create() {   
    if (Users.isLogged()) {
      $meteor.call('createGame', ctrl.newGame.title)
        .then(success);
    } else {
      Toast.toast('Please log in to create a game');
    }

    function success(newGameId) {
      ctrl.newGame.title = '';
      $state.go('game', { id: newGameId });
    }
  }

  function destroy(gameId) {
    $meteor.call('destroyGame', gameId);
  }

  function userCanDestroy(game) {
    return Users.isOwnerOrAdmin(game);
  }

  function archive(gameId) {
    $meteor.call('archiveGame', gameId);
    //   .then(success);

    // function success() { 
    //   ctrl.games = _.reject(ctrl.games, function(g) {
    //     return g.gameId = gameId;
    //   });
    // }
  }

  function userCanArchive(game) {
    return Users.isOwnerOrAdmin(game);
  }

}