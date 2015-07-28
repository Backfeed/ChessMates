angular.module('blockchess.game.model', [])
.service('GameModel', GameModel);

function GameModel($meteor) {

  var model = {
    set: set,
    restart: restart,
    game: {},
    gameNotAuto: {},
    timer: {},
    status: {},
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
      evaluations   : $meteor.collection(function() { return Evaluations.find({ gameId: id }) }).subscribe('evaluations'),
      comments      : $meteor.collection(function() { return Comments.find({ gameId: id }) }).subscribe('comments')
    });
  }

  function restart() { Meteor.call('restart', "1"); }

}
