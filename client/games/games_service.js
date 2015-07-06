angular.module('blockchess.games.service', [])
.service('GamesService', GamesService)

function GamesService($mdDialog) {
    
  return {
    openSuggestMoveModal: openSuggestMoveModal
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

}