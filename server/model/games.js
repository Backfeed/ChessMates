Meteor.publish('games', function (options, gameId) {
  //return Games.find({});
  //return Games.findOne({"game_id": gameId});
  return Games.find({"game_id": "1"});
});

Meteor.publish('timer', function (options, gameId) {
  return Timer.find({"game_id": "1"});
});

// TODO :: I think thi will break with multiple games / clans
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
  Games.update(
    { game_id: gameId },
    { $set: {
        played_this_turn: [],
        suggested_moves: [],
        turns: [],
        moves: [],
        pgn: [],
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
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
  var moves;
  console.log(turn, ": ", move);
  movesStream.emit('move', move, turn);
  logTurn(gameId, move, turn, logTurnCB);

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
  var newFen = getFen(move);
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

function updateTimer(gameId, timer) {
  Timer.update(
    { game_id: gameId }, timer
  );
}

function startTurn(gameId) {
  resetPlayed(gameId);
  var timer = Timer.findOne({ game_id: gameId });
  timer.timeLeft = timer.timePerMove;
  Meteor.clearInterval(GameInterval);
  GameInterval = Meteor.setInterval(function() {
    timer.timeLeft -= 1000;
    if (timer.timeLeft <= 0) { endTurn(gameId); }
    else               { updateTimer(gameId, timer); }
  }, 1000);
}

function resetPlayed(gameId) {
  Games.update({ game_id: gameId }, { $set: { played_this_turn: [] } });
}

function endGame(gameId) {
  Meteor.clearInterval(GameInterval);
}

function clientDone(gameId) {
  validateGame(gameId);
  validateUniqueness(gameId);
  Games.update(
    { game_id: gameId },
    { $push: { played_this_turn: Meteor.userId() } },
    function() { if (isAllClientsFinished(gameId)) { endTurn(gameId); } }
  )

  function validateUniqueness() {
    var played = Games.findOne({game_id: gameId}).played_this_turn;
    if ( _.contains(played, Meteor.userId()) )
      throw new Meteor.Error(403, 'Already pressed "Im done"');
  }

}

function isAllClientsFinished(gameId) {
  playersN = Meteor.users.find({ "status.online": true }).count();
  playedN = Games.findOne({game_id: gameId}).played_this_turn.length;
  return playersN === playedN;
}

function validateGame(gameId) {
  check(gameId, String);
  if (! Meteor.userId())
    throw new Meteor.Error(403, "You must be logged in");
  var game = Games.findOne({ game_id: gameId });
  if (! game)
    throw new Meteor.Error(404, "No such game");
}

function getFen(move) {
  Chess.move(move);
  return Chess.fen();
}

function endTurn(gameId) {
  validateGame(gameId);
  Meteor.clearInterval(GameInterval);
  var move = Meteor.call('protoEndTurn', gameId);
  executeMove(gameId, move, 'clan');
}
