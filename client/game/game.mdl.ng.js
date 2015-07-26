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
    model.game = $meteor.object(Game, { game_id: id }).subscribe('game');
    model.gameNotAuto = $meteor.object(Game, { game_id: id }, false).subscribe('game');
    model.timer = $meteor.object(Timer, { game_id: id }, false).subscribe('timer');
    model.status = $meteor.object(Status, { game_id: id }, false).subscribe('status');
    model.suggested_moves = $meteor.collection(function() { return SuggestedMove.find({ game_id: id }) }).subscribe('suggested_moves');
    model.evaluations = $meteor.collection(function() { return Evaluation.find({ game_id: id }) }).subscribe('suggested_moves');
    model.comments = $meteor.collection(function() { return Comment.find({ game_id: id }) }).subscribe('suggested_moves');
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
