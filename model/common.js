Games            = new Mongo.Collection('games');
timerStream      = new Meteor.Stream('timer');
connectionStream = new Meteor.Stream('connection');
movesStream      = new Meteor.Stream('engineMove');

Games.allow({
    insert: function (userId)                         { return true; },
    update: function (userId, game, fields, modifier) { return true; },
    remove: function (userId, game)                   { return true; }
});

function foo(msg){ console.log('foo', msg);}

Meteor.methods({
  foo: foo,
  distributeReputation: distributeReputation,
  AIEvaluationCB: AIEvaluationCB,
  AIGetMoveCb: AIGetMoveCb,
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
function AIEvaluationCB(score) {
  console.log("score is: ", score);
}

function AIGetMoveCb(move) {
  console.log('AI Move: ', move);
  if (Meteor.isServer) { executeMove("1", move, "AI"); }
}

function distributeReputation(gameId) {
  validateGame(gameId);
  // Redistribute reputation after move
  console.log('distributeReputation');
}

function executeMove(gameId, move, turn) {
  console.log(turn, ": ", move);
  if (Meteor.isClient) {
    movesStream.emit('move', move, turn);
  } 
  else if (Meteor.isServer) {
    var prevFen = Games.findOne({ game_id: gameId }).fen;
    Games.update({ game_id: gameId } , { $push: { moves: move.from+move.to     } });
    Games.update({ game_id: gameId } , { $set:  { fen:   getFen(prevFen, move) } });
    if (turn === 'clan') { Engine.getMove('e2e4'); } // TODO get history
  }
}

function endTurn(gameId) {
  console.log('endTurn');
  Meteor.clearInterval(GameInterval);
}

function updateTimer(gameId, timeLeft) {
  timerStream.emit('timer', timeLeft);
}

function startTurn(gameId) {
  validateGame(gameId);
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
  console.log('client Done!')

  if (Meteor.isServer) {
    ClientsDone.push(this.userId);
    console.log('client pushed')

    if (isAllClientsFinished()) {
      allClientsDone()
    }

    function allClientsDone() {
      console.log('All clients done')
      move = { from: 'e2', to: 'e4' }; // TODO :: Getfrom protocol
      executeMove(gameId, move, 'clan');
      ClientsDone = [];
    }

    function isAllClientsFinished() {
      console.log("Users Online: ", Meteor.users.find({ "status.online": true }).count())
      console.log("Users Done: ", ClientsDone.length)
      return ClientsDone.length !== 0 && 
             Meteor.users.find({ "status.online": true }).count() === ClientsDone.length;
    }
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

function getFen(prevFen, move) {
  if (Meteor.isServer) {
    Chess.load(prevFen);
    Chess.move(move);
    return Chess.fen();
  }
}