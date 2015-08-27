angular.module('blockchess.game.model', [])
.service('GameModel', GameModel);

// TODO :: Make for multiple games

function GameModel($meteor) {

  var model = {
    set: set,
    game: {},
    timer: {},
    status: {},
    suggestedMoves: [],
    evaluations: []
  };

  return model;

  function set(id) {
    angular.extend(model, {
      game          : $meteor.object(Games,  { gameId: id }, false).subscribe('games'),
      timer         : $meteor.object(Timers, { gameId: id }, false).subscribe('timers'),
      suggestedMoves: $meteor.collection(SuggestedMoves),
      evaluations   : $meteor.collection(function() { return Evaluations.find({ gameId: id }) }).subscribe('evaluations')
    });

    Tracker.autorun(function() {
      var turnIndex = Session.get('turnIndex');
      $meteor.subscribe('suggestedMoves', {}, id, turnIndex);
    });
  }

}