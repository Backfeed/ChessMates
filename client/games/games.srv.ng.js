angular.module('blockchess.games.service', [])
.service('GamesService', GamesService)

function GamesService($mdDialog, GamesModel) {
    
  return {
    openSuggestMoveModal: openSuggestMoveModal,
    selectedMoveChanged: selectedMoveChanged,
    formatMoveFrom: formatMoveFrom,
    cancelMoveHighlights: cancelMoveHighlights,
    getMoveBy: getMoveBy
  }

  function openSuggestMoveModal(notation) {
    return $mdDialog.show({
      templateUrl: "client/utilities/suggest_move_modal/suggest_move_modal.ng.html",
      controller: 'suggestMoveModalController',
      controllerAs: 'ctrl',
      bindToController: true,
      locals: { notation: notation }
    });
  }

  function getMoveBy(attr, val) {
    var move;
    GamesModel.game.suggested_moves.forEach(function(m) {
      if (m[attr] === val) { move = m; }
    });
    return move;
  }

  function formatMoveFrom(notation) {
    return {
      from: notation.substr(0,2),
      to: notation.substr(2)
    }
  }

  function selectedMoveChanged(move) {
    cancelMoveHighlights();
    if (!move || !move.notation) { return; }
    var formatted = formatMoveFrom(move.notation);
    $('.square-'+formatted.from + ', .square-'+formatted.to).addClass('highlight-square');
  }

  function cancelMoveHighlights() {
    $('.highlight-square').removeClass('highlight-square');
  }

}