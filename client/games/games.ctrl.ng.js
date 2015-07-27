angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($meteor) {
  var ctrl = this;

  angular.extend(ctrl, {
    games: []
  });

  init();

  function init() {
    ctrl.games = $meteor.collection(Games).subscribe('games');
  }

}