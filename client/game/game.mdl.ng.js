angular.module('blockchess.game.model', [])
.service('GameModel', GameModel);

function GameModel($meteor) {

  var model = {
    init: init,
    game: {},
    timer: {}
  };

  return model;

  function init(gameId) {
    log(gameId);
    model.game[gameId] = $meteor.object(Games, { _id: gameId }).subscribe('games', gameId);
    model.timer[gameId] = $meteor.object(Timers, { gameId: gameId }).subscribe('timers', gameId);
  }

}

function log() {
  console.log('\n\n');
  console.log('CLIENT: MODEL: GAME: ');
  _.each(arguments, function(msg) {
    console.log(msg);
  });
  console.log('\n\n');
}