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
    evaluations: [],
    comments: []
  };

  return model;

  function set(id) {
    angular.extend(model, {
      game          : $meteor.object(Games,  { gameId: id }).subscribe('games'),
      gameNotAuto   : $meteor.object(Games,  { gameId: id }, false).subscribe('games'),
      timer         : $meteor.object(Timers, { gameId: id }, false).subscribe('timers'),
      status        : $meteor.object(Status, { gameId: id }, false).subscribe('status'),
      suggestedMoves: $meteor.collection(SuggestedMoves, { gameId: id }).subscribe('suggestedMoves')
    });
  }

  function restart() { Meteor.call('restart', "1"); }
  function getTurnIndex() { return model.game.moves.length + 1; }

}