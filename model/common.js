Games            = new Mongo.Collection('games');
timerStream      = new Meteor.Stream('timer');
connectionStream = new Meteor.Stream('connection');
movesStream      = new Meteor.Stream('engineMove');
restartStream    = new Meteor.Stream('restart');

Games.allow({
    insert: function (userId)                         { return true; },
    update: function (userId, game, fields, modifier) { 
      return !!userId &&
              !suggestedMoveExists(game.suggested_moves, modifier);
    },
    remove: function (userId, game)                   { return true; }
});

function suggestedMoveExists(suggestedMoves, modifier) {
  return modifier.$set && 
         modifier.$set.suggested_moves &&
         modifier.$set.suggested_moves[0] &&
         _.find(suggestedMoves, function(sug_move) {
          return sug_move.notation === modifier.$set.suggested_moves[0].notation;
         });
}

function foo(msg){ console.log('foo', msg);}

Meteor.methods({
  foo: foo,
  AIEvaluationCB: AIEvaluationCB,
  validateGame: validateGame,
  AIGetMoveCb: AIGetMoveCb,
  executeMove: executeMove,
  updateTimer: updateTimer,
  clientDone: clientDone,
  startTurn: startTurn,
  restart: restart,
  endGame: endGame
});

if (Meteor.isServer) {
  GameInterval = {};
  ClientsDone = [];

  Meteor.users.find({ "status.online": true }).observe({
    added: function(user) { connectionStream.emit('connections'); },
    removed: function(user) { connectionStream.emit('connections'); }
  });
}
function AIEvaluationCB(score) {
  console.log("score is: ", score);
}

function AIGetMoveCb(move) {
  console.log('AI Move: ', move);
  if (Meteor.isServer) { executeMove("1", move, "AI"); }
}

function restart(gameId) {
  if (Meteor.isServer) {
    ClientsDone = [];
    Chess.reset();
    resetGameData(gameId);
  }
}

function resetGameData(gameId) {
  Games.update(
    { game_id: gameId },
    { $set: {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        pgn: [],
        turns: [],
        moves: [],
        suggested_moves: [],
        settings: {
          timePerMove: 300000
        }
      }
    },
    CB
  );

  function CB(err, result) {
    console.log('Reset Game Data CB Error: ', err);
    console.log('Reset Game Data CB result: ', result);
    startTurn(gameId);
    restartStream.emit('restart');
  }
}

function executeMove(gameId, move, turn) {
  if (Meteor.isServer) {
    var moves;
    console.log(turn, ": ", move);
    movesStream.emit('move', move, turn);
    logTurn(gameId, move, turn, logTurnCB);
  }

  function logTurnCB(err, result) {
    console.log("logTurnCB: err", err);
    console.log("logTurnCB: result", result);
    moves = Games.findOne({ game_id: gameId }).moves.join(" ");
    console.log("logTurnCB: moves", moves);
    startTurn(gameId);
    if (turn === 'clan') {
      Meteor.setTimeout(function() {
        Engine.getMove(moves);
      }, 3000);
    }
  }
}

function logTurn(gameId, move, turn, logTurnCB) {
  var game = Games.findOne({ game_id: gameId });
  var newFen = getFen(game.fen, move);
  console.log("logTurn: newFen: ", newFen);
  if (turn === "AI") {
    Games.update(
      { game_id: gameId },
      {
        $push: { moves: move.from+move.to },
        $set:  { fen:   newFen }
      },
      logTurnCB
    );
  }
  if (turn === "clan") {
    Games.update(
      { game_id: gameId },
      {
        $push: { moves: move.from+move.to,      turns: game.suggested_moves },
        $set:  { fen:   newFen, suggested_moves: [] }
      },
      logTurnCB
    );
  }
}

function updateTimer(timeLeft) {
  timerStream.emit('timer', timeLeft);
}

function startTurn(gameId) {
  if (Meteor.isServer) {
    var game = Games.findOne({ game_id: gameId });
    var timeLeft = game.settings.timePerMove;
    Meteor.clearInterval(GameInterval);
    GameInterval = Meteor.setInterval(function() {
      timeLeft -= 1000;
      if (timeLeft <= 0) { Meteor.call('endTurn', gameId); }
      else               { Meteor.call('updateTimer', timeLeft); }
    }, 1000);
  }
}

function endGame(gameId) {
  if (Meteor.isServer) {
    Meteor.clearInterval(GameInterval);
  }
}

function clientDone(gameId) {
  validateGame(gameId);
  console.log('client Done!');

  if (Meteor.isServer) {
    ClientsDone.push(this.userId);
    console.log('client pushed');

    if (isAllClientsFinished()) {
      allClientsDone()
    }

    function allClientsDone() {
      console.log('All clients done');

      var notation = Games.findOne({ game_id: gameId }).suggested_moves[0].notation; // TODO :: Getfrom protocol
      var move = { from: notation.substr(0,2), to: notation.substr(2) };
      executeMove(gameId, move, 'clan');
      ClientsDone = [];
    }

    function isAllClientsFinished() {
      console.log("Users Online: ", Meteor.users.find({ "status.online": true }).count());
      console.log("Users Done: ", ClientsDone.length);
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
    console.log('prevFen ', prevFen);
    console.log('Chess.fen() BEFORE MOVE ', Chess.fen());
    Chess.move(move);
    console.log('Chess.fen() AFTER MOVE', Chess.fen());
    return Chess.fen();
  }
}
