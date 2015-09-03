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

function HistoryController(GameService, ChessBoard) {
  var ctrl = this;

  angular.extend(ctrl, {
    highlight: highlight,
    unHighlight: unHighlight,
    getTurnBy: getTurnBy
  });

  function getTurnBy($index) {
    var normalizedIndex = $index + 1;
    if ( normalizedIndex === 1 )
      return 1;

    return normalizedIndex / 2 - 0.5 + 1;
  }

  function highlight(move) {
    var formatted = GameService.formatMoveFrom(move);

    ChessBoard.highlight(formatted.from, formatted.to);
  }

  function unHighlight(move) {
    var formatted = GameService.formatMoveFrom(move);

    ChessBoard.unHighlight(formatted.from, formatted.to);
  }



}