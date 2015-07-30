angular.module('blockchess.game.model', [])
.service('GameModel', GameModel);

function GameModel($meteor) {

  var model = {
    set: set,
    restart: restart,
    game: {},
    timer: {},
    status: {},
    suggestedMoves: [],
    evaluations: [],
    comments: []
  };

  return model;

  function set(id) {
    angular.extend(model, {
      game          : $meteor.object(Games,  { gameId: id }, false).subscribe('games'),
      timer         : $meteor.object(Timers, { gameId: id }, false).subscribe('timers'),
      suggestedMoves: $meteor.collection(SuggestedMoves),
      evaluations   : $meteor.collection(function() { return Evaluations.find({ gameId: id }) }).subscribe('evaluations'),
      comments      : $meteor.collection(function() { return Comments.find({ gameId: id }) }).subscribe('comments')
    });

    Tracker.autorun(function() {
      var turnIndex = Session.get('turnIndex');
      $meteor.subscribe('suggestedMoves', {}, id, turnIndex);
    });
  }

  function restart() { Meteor.call('restart', "1"); }

}
