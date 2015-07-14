Games            = new Mongo.Collection('games');
timerStream      = new Meteor.Stream('timer');
whosTurnStream   = new Meteor.Stream('turnChanged');
connectionStream = new Meteor.Stream('connection');
engineMoveStream = new Meteor.Stream('engineMove');
engineEvalStream = new Meteor.Stream('engineEval');

engineMoveStream.on('engineMove', engineResponse);
engineEvalStream.on('engineEval', evalResponse);

Games.allow({
    insert: function (userId)                         { return true; },
    update: function (userId, game, fields, modifier) { return true; },
    remove: function (userId, game)                   { return true; }
});

Meteor.methods({
  distributeReputation: distributeReputation,
  executeMove: executeMove,
  updateTimer: updateTimer,
  clientDone: clientDone,
  startTurn: startTurn,
  pauseGame: pauseGame,
  endTurn: endTurn,
  endGame: endGame
});

Meteor.users.find({ "status.online": true }).observe({
  added: function(user) { connectionStream.emit('connections'); },
  removed: function(user) { connectionStream.emit('connections'); }
});

if (Meteor.isServer) {
  GameInterval = {};
  ClientsDone = [];
}

function distributeReputation(gameId) {
  validateGame(gameId);
  // Redistribute reputation after move
  console.log('distributeReputation');
}

function executeMove(history) {
  console.log('executeMove', history);
  if (Meteor.isServer) { Engine.getMove(history) }
}

function endTurn(gameId) {
  console.log('endTurn');
  Meteor.clearInterval(GameInterval);
  whosTurnStream.emit('turnChanged', 'AI');
}

function updateTimer(gameId, timeLeft) {
  timerStream.emit('timer', timeLeft);
}

function startTurn(gameId) {
  validateGame(gameId);

  whosTurnStream.emit('turnChanged', 'Clan');
  if (Meteor.isServer) {
    var game = Games.findOne({ game_id: gameId });
    var timeLeft = game.settings.timePerMove;
    Meteor.clearInterval(GameInterval);
    GameInterval = Meteor.setInterval(function() {
      timeLeft -= 1000;
      if (timeLeft <= 0) { Meteor.call('endTurn', gameId); } 
      else               { Meteor.call('updateTimer', gameId, timeLeft); }
    }, 1000);
  }
}

function endGame(gameId) {
  validateGame(gameId);

  if (Meteor.isServer) {
    Meteor.clearInterval(GameInterval);
  }
}

function pauseGame(gameId) {
  validateGame(gameId);

  if (Meteor.isServer) {

  }
}

function clientDone(gameId) {
  validateGame(gameId);

  ClientsDone.push(this.userId);
  if (isAllClientsFinished()){
    allClientsDone()
  }

  function allClientsDone() {
    whosTurnStream.emit('turnChanged', 'AI');
    executeMove('e2e4');
    ClientsDone = [];
  }

  function isAllClientsFinished() {
    return ClientsDone.length !== 0 && 
           Meteor.users.find({ "status.online": true }).count() === ClientsDone.length;
  }
}

function validateGame(gameId) {
  check(gameId, String);
  if (! Meteor.userId())
    throw new Meteor.Error(403, "You must be logged in");
  var game = Games.findOne({ game_id: gameId });
  if (! game)
    throw new Meteor.Error(404, "No such game");
}

function engineResponse(move) {
  console.log('engineResponse', move);
}

function evalResponse(score) {
  console.log('engineResponse', score);
}