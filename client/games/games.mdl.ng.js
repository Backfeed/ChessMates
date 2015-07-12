angular.module('blockchess.games.model', [])
.service('GamesModel', GamesModel)

function GamesModel($meteor) {

  var model = {
    logTurn: logTurn,
    restart: restart,
    game: {},
    set: set
  };

  return model;

  function logTurn() {
    if (model.game.turns) {
      model.game.turns.push(model.game.suggested_moves);
    } else {
      model.game.turns = [model.game.suggested_moves];
    }
    model.game.suggested_moves = [];
  }

  function set(id) {
    model.game = $meteor.object(Games, { game_id: id }).subscribe('games');
    model.gameNotAuto = $meteor.object(Games, { game_id: id }, false).subscribe('games');
  }

  function restart() {
    angular.extend(model.game, {
      fen: 'start',
      pgn: [],
      turns: [],
      suggested_moves: [],
      settings: {
        timePerMove: 300000
      }
    });
  }

}
