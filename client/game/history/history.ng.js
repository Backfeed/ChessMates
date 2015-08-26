angular.module('blockchess.game.history', [])
.directive('history', HistoryDirective);

function HistoryDirective() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'client/game/history/history.ng.html',
    controller: HistoryController,
    scope: { moves: '=' }
  }
}

function HistoryController() {
  var ctrl = this;

  angular.extend(ctrl, {

  });

}