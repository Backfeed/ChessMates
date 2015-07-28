angular.module('blockchess.game.model', [])
.service('GameModel', GameModel);

function GameModel($meteor) {

  var model = {
    set: set,
    getTurnIndex: getTurnIndex,
    restart: restart,
    game: {},
    gameNotAuto: {},
    timer: {},
    status: {},
    suggestedMoves: [],
    evalutions: [],
    comments: []
  };

  return model;

  function set(id) {
    angular.extend(model, {
      game          : $meteor.object(Games,  { gameId: id }).subscribe('games'),
      gameNotAuto   : $meteor.object(Games,  { gameId: id }, false).subscribe('games'),
      timer         : $meteor.object(Timers, { gameId: id }, false).subscribe('timers'),
      status        : $meteor.object(Status, { gameId: id }, false).subscribe('status'),
      suggestedMoves: $meteor.collection(function() { return SuggestedMoves.find({ gameId: id }) }).subscribe('suggestedMoves'),
      evaluations   : $meteor.collection(function() { return Evaluations.find({ gameId: id }) }).subscribe('suggestedMoves'),
      comments      : $meteor.collection(function() { return Comments.find({ gameId: id }) }).subscribe('suggestedMoves')
    });
  }

  function restart() { Meteor.call('restart', "1"); }
  function getTurnIndex() { return model.game.moves.length + 1; }

}