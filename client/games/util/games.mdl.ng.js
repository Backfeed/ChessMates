angular.module('blockchess.games.util.model', [])
.service('GamesModel', GamesModel);

function GamesModel($meteor) {

  var model = {
    restart: restart,
    game: {},
    set: set
  };

  return model;

  function set(id) {
    model.game = $meteor.object(Games, { game_id: id }).subscribe('games');
    model.gameNotAuto = $meteor.object(Games, { game_id: id }, false).subscribe('games');
    model.timer = $meteor.object(Timer, { game_id: id }, false).subscribe('timer');
  }

  function restart() {
    angular.extend(model.game, {
      played_this_turn: [],
      suggested_moves: [],
      turns: [],
      moves: [],
      pgn: [],
      fen: 'start'
    });
  }

}
