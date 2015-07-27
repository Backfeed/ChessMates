angular.module('blockchess.game.model', [])
.service('GameModel', GameModel);

function GameModel($meteor) {

  var model = {
    restart: restart,
    game: {},
    set: set
  };

  return model;

  function set(id) {
    model.game = $meteor.object(Games, { gameId: id }).subscribe('games');
    model.gameNotAuto = $meteor.object(Games, { gameId: id }, false).subscribe('games');
    model.timer = $meteor.object(Timers, { gameId: id }, false).subscribe('timers');
    model.status = $meteor.object(Status, { gameId: id }, false).subscribe('status');
    model.suggestedMoves = $meteor.collection(function() { return SuggestedMoves.find({ gameId: id }) }).subscribe('suggestedMoves');
    model.evaluations = $meteor.collection(function() { return Evaluations.find({ gameId: id }) }).subscribe('suggestedMoves');
    model.comments = $meteor.collection(function() { return Comments.find({ gameId: id }) }).subscribe('suggestedMoves');
  }

  function restart() {
    angular.extend(model.game, {
      played_this_turn: [],
      moves: [],
      pgn: [],
      fen: 'start'
    });
  }

}
