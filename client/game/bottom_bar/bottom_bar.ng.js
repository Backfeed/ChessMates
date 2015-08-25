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

function bottomBarController() {
  var ctrl = this;
  angular.extend(ctrl, {
    
  });

}