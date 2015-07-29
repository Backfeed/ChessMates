Meteor.publish('games', function (options, gameId) {
  return Games.find({"gameId": "1"});
});

Meteor.publish('status', function (options, gameId) {
  return Status.find({"gameId": "1"});
});

Meteor.methods({
  AIEvaluationCB: AIEvaluationCB,
  validateGame: validateGame,
  AIGetMoveCb: AIGetMoveCb,
  executeMove: executeMove,
  clientDone: clientDone,
  restart: restart
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
        turnIndex: 1,
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

  Evaluations.remove({});
  SuggestedMoves.remove({ gameId: gameId });
  Comments.remove({ gameId: gameId });

  function restartCB(err, result) {
    if (err) throw new Meteor.Error(403, err);
    Meteor.call('startTurn',gameId);
    Status.update(
      { gameId: gameId },
      { $set: { restarted: false } }
    );
  }
}

function executeMove(gameId, move, turn) {
  console.log(turn, ": ", move);
  logTurn();

  function logTurn() {
    var game = Games.findOne({ gameId: gameId });
    var newFen = getFen(move);
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
  function logTurnCB(err, result) {
    if (err) throw new Meteor.Error(403, err);
    var newTurn = parseInt(Status.findOne({ gameId: gameId }).turnIndex);
    newTurn++;
    Status.update(
      { gameId: gameId },
      { $set: { turn: turn , turnIndex: newTurn } },
      initNextTurn
    );
  }
  function initNextTurn () {
    Meteor.call('startTurn',gameId);
    if (turn === 'clan') {
      var moves = Games.findOne({ gameId: gameId }).moves.join(" ");
      Meteor.setTimeout(function() {
        Engine.getMove(moves);
      }, 2000);
    }
  }
}

function clientDone(gameId) {
  validateGame(gameId);
  validateUser(this.userId);
  validateUniqueness(gameId);
  Games.update(
    { gameId: gameId },
    { $push: { playedThisTurn: Meteor.userId() } },
    function() { if (isAllClientsFinished(gameId)) { Meteor.call('endTurn' ,gameId); } }
  );

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

