angular.module('blockchess.game.suggestedMoves.move.evaluation', [])
.service('Evaluation', Evaluation);

function Evaluation(Toast) {

  var service = {
    rate: rate,
    canRate: canRate
  };

  return service;

  function rate(moveId, stars) {
    // Validations
    if (!Meteor.userId())
      return Toast.toast('Must be logged in to evaluate moves');
    if (!Meteor.user().reputation)
      return Toast.toast('Must have reputation to evaluate moves');

    Meteor.call('rate', moveId, stars);
  }
}

function canRate() {
   return !!Meteor.userId() && Meteor.user().reputation;
}