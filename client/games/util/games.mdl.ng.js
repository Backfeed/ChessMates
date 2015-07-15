angular.module('blockchess.games.util.model', [])
.service('GamesModel', GamesModel)

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
  }

  function restart() {
    angular.extend(model.game, {
      fen: 'start',
      pgn: [],
      turns: [],
      moves: [],
      suggested_moves: [],
      settings: {
        timePerMove: 300000
      }
    });
  }

}
