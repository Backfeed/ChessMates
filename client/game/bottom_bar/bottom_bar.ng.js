angular.module('blockchess.game.bottomBar', [])
.directive('bottomBar', bottomBar);

function bottomBar() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'client/game/bottom_bar/bottom_bar.ng.html',
    controller: bottomBarController,
    retrict: 'E',
    scope: {}
  };
}

function bottomBarController($meteor) {
  var ctrl = this;
  angular.extend(ctrl, {
    player: {},
    players: []
  });

  init();

  function init() {
    getPlayers();
    getPlayer();
  }

  function getPlayer() {
    ctrl.player = Meteor.user();
  }

  function getPlayers() {
    ctrl.players = $meteor.collection(function() {
      return getUsersBy({ 'status.online': true }, { fields: { emails: 1, status: 1 } })
    }, false).subscribe('userStatus');
  }

}