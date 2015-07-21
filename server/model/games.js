Meteor.publish('games', function (options, gameId) {
  return Games.find({});
});

// TODO :: I think thi will break with multiple games / clans
GameInterval = {};
ClientsDone = [];

Meteor.methods({
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
        played_this_turn: [],
        suggested_moves: [],
        turns: [],
        moves: [],
        pgn: [],
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        settings: {
          timePerMove: 300000
        }
      }
    },
    CB
  );

  function CB(err, result) {
    if (err) throw new Meteor.Error(403, err);
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
    if (err) throw new Meteor.Error(403, err);
    moves = Games.findOne({ game_id: gameId }).moves.join(" ");
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
    resetPlayed(gameId);
    var game = Games.findOne({ game_id: gameId });
    var timeLeft = game.settings.timePerMove;
    Meteor.clearInterval(GameInterval);
    GameInterval = Meteor.setInterval(function() {
      timeLeft -= 1000;
      if (timeLeft <= 0) { endTurn(gameId); }
      else               { updateTimer(timeLeft); }
    }, 1000);
  }
}

function resetPlayed(gameId) {
  Games.update({ game_id: gameId }, { $set: { played_this_turn: [] } });
}

function endGame(gameId) {
  if (Meteor.isServer) {
    Meteor.clearInterval(GameInterval);
  }
}

function clientDone(gameId) {
  if (Meteor.isServer) {
    validateGame(gameId);
    validateUniqueness();

    // TODO :: Combine ClientDone with played_this_turn
    ClientsDone.push(this.userId);

    Games.update(
      { game_id: gameId },
      { $push: { played_this_turn: Meteor.userId() } }
    )

    if (isAllClientsFinished())
      allClientsDone()

    function allClientsDone() {

      ClientsDone = [];
      endTurn(gameId);
    }

    function isAllClientsFinished() {
      return ClientsDone.length !== 0 &&
             Meteor.users.find({ "status.online": true }).count() === ClientsDone.length;
    }

    function validateUniqueness() {
      if ( _.contains(ClientsDone, Meteor.userId()) )
        throw new Meteor.Error(403, 'Already pressed "Im done"');
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
    Chess.move(move);
    return Chess.fen();
  }
}

function endTurn(gameId) {
  validateGame(gameId);
  Meteor.clearInterval(GameInterval);
  var move = Meteor.call('protoEndTurn', gameId);
  executeMove(gameId, move, 'clan');
}