Meteor.publish('games', function (options, gameId) {
  return Games.find({"gameId": "1"});
});

Meteor.publish('timers', function (options, gameId) {
  return Timers.find({"gameId": "1"});
});

Meteor.publish('status', function (options, gameId) {
  return Status.find({"gameId": "1"});
});

Meteor.publish('suggestedMoves', function (options, gameId) {
  return SuggestedMoves.find({"gameId": "1"});
});

Meteor.publish('comments', function (options, gameId) {
  return Comments.find({"gameId": "1"});
});

// TODO :: I think this will break with multiple games / clans
GameInterval = {};

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
  executeMove("1", move, "AI");
}

function restart(gameId) {
  Chess.reset();
  resetGameData(gameId);
}

function resetGameData(gameId) {
  Status.update(
    { gameId: gameId },
    { $set:  {
        turn: 'start',
        restarted: true
      }
    }
  );

  Games.update(
    { gameId: gameId },
    { $set: {
        playedThisTurn: [],
        moves: [],
        pgn: [],
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      }
    },
    restartCB
  );

  Timers.update(
    { gameId: gameId },
    { $set: {
        inPlay: false,
        timePerMove: 300000,
        timeLeft: 300000
      }
    }
  );

  Evaluations.remove({ gameId: gameId });
  SuggestedMoves.remove({ gameId: gameId });
  Comments.remove({ gameId: gameId });

  function restartCB(err, result) {
    if (err) throw new Meteor.Error(403, err);
    startTurn(gameId);
    Status.update(
      { gameId: gameId },
      { $set: { restarted: false } }
    );
  }
}

function executeMove(gameId, move, turn) {
  var moves;
  console.log(turn, ": ", move);
  logTurn(gameId, move, turn, logTurnCB);

  function logTurnCB(err, result) {
    if (err) throw new Meteor.Error(403, err);
    moves = Games.findOne({ gameId: gameId }).moves.join(" ");
    Status.update(
      { gameId: gameId },
      { $set: { turn: turn } },
      initNextTurn
    );
  }

  function initNextTurn () {
    startTurn(gameId);
    if (turn === 'clan') {
      Meteor.setTimeout(function() {
        Engine.getMove(moves);
      }, 2000);
    }
  }

}

function logTurn(gameId, move, turn, logTurnCB) {
  var game = Games.findOne({ gameId: gameId });
  var newFen = getFen(move);
  if (turn === "AI") {
    Games.update(
      { gameId: gameId },
      {
        $push: {
          moves: move.from+move.to,
          pgn: move
        },
        $set:  { fen:   newFen }
      },
      logTurnCB
    );
  }
  if (turn === "clan") {
    var suggestedMoves = SuggestedMoves.find({ gameId: gameId });
    SuggestedMoves.update(
      { gameId: gameId },
      { $set: { moves: [] } }
    );
    Games.update(
      { gameId: gameId },
      {
        $push: {
          moves: move.from+move.to,
          pgn: move
        },
        $set:  { fen: newFen }
      },
      logTurnCB
    );
  }
}

function startTurn(gameId) {
  resetPlayed(gameId);
  var timer = Timers.findOne({ gameId: gameId });
  timer.timeLeft = timer.timePerMove;
  Meteor.clearInterval(GameInterval);
  GameInterval = Meteor.setInterval(function() {
    timer.timeLeft -= 1000;
    if (timer.timeLeft <= 0) { endTurn(gameId); }
    else                     { updateTimer(gameId, timer); }
  }, 1000);
}

function updateTimer(gameId, timer) {
  Timers.update({ gameId: gameId }, timer );
}

function endTurn(gameId) {
  validateGame(gameId);
  Meteor.clearInterval(GameInterval);
  var move = Meteor.call('protoEndTurn', gameId);
}

function resetPlayed(gameId) {
  Games.update(
    { gameId: gameId }, 
    { $set: { playedThisTurn: [] } }
  );
}

function endGame(gameId) {
  Meteor.clearInterval(GameInterval);
}

function clientDone(gameId) {
  validateGame(gameId);
  validateUser(this.userId);
  validateUniqueness(gameId);
  Games.update(
    { gameId: gameId },
    { $push: { playedThisTurn: Meteor.userId() } },
    function() { if (isAllClientsFinished(gameId)) { endTurn(gameId); } }
  )

  function validateUniqueness() {
    var played = Games.findOne({gameId: gameId}).playedThisTurn;
    if ( _.contains(played, Meteor.userId()) )
      throw new Meteor.Error(403, 'Already pressed "Im done"');
  }

}

function isAllClientsFinished(gameId) {
  playersN = Meteor.users.find({ "status.online": true }).count();
  playedN = Games.findOne({gameId: gameId}).playedThisTurn.length;
  return playersN === playedN;
}

function validateGame(gameId) {
  check(gameId, String);
  var game = Games.findOne({ gameId: gameId });
  if (! game)
    throw new Meteor.Error(404, "No such game");
}

function validateUser(userId) {
  check(userId, String);
  if (! userId)
    throw new Meteor.Error(403, "You must be logged in");
}

function getFen(move) {
  Chess.move(move);
  return Chess.fen();
}

