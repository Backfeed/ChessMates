angular.module('blockchess.clans.util.clanCard', [])
.directive('clanCard',clanCard);

function clanCard() {
  return {
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: "client/clans/util/clan_card/clan_card.ng.html",
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