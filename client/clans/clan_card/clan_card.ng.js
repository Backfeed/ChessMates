angular.module('blockchess.clans.clanCard', [])
.directive('clanCard',clanCard);

function clanCard() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/clans/clan_card/clan_card.ng.html",
    controller: clanCardController,
    scope: { clan: '=' }
  }
}

function clanCardController() {
  var ctrl = this;
  angular.extend(ctrl, {

  });

  init();

  function init() {

  }

}