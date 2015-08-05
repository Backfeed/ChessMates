Meteor.publish('games', publish);

Meteor.methods({
  AIEvaluationCB: AIEvaluationCB,
  validateGame: validateGame,
  AIGetMoveCb: AIGetMoveCb,
  executeMove: executeMove,
  clientDone: clientDone,
  endTurn: endTurn,
  restart: restart
});

function publish(options, gameId) {
  return Games.find({"gameId": "1"});
}

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
    { gameId: gameId },
    { $set: {
        playedThisTurn: [],
        moves: [],
        pgn: [],
        turnIndex: 1,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      }
    },
    restartCB
  );

  Timers.update(
    { gameId: gameId },
    { $set: {
        inPlay: true,
        timePerMove: 90000,
        timeLeft: 90000
      }
    }
  );

  Evaluations.remove({});
  SuggestedMoves.remove({ gameId: gameId });
  Comments.remove({ gameId: gameId });

  function restartCB(err, result) {
    if (err) throw new Meteor.Error(403, err);
    Meteor.call('startTurnTimer',gameId);
  }
}

Games.before.update(function(userId, doc, fieldNames, modifier, options){
  console.log('before game collection updated');
});

Games.after.update(function(userId, doc, fieldNames, modifier, options){
  console.log('after game collection updated');
});

function executeMove(gameId, move, turn) {
  console.log(turn, ": ", move);
  var game = Games.findOne({ gameId: gameId });
  var notation = move.from + move.to;

  Games.update(
    { gameId: gameId },
    {
      $push: {
        moves: notation,
        pgn: move
      },
      $set:  {
        turn: turn,
        turnIndex: game.turnIndex + 1,
        playedThisTurn: [],
        fen: getFen(move)
      }
    },
    executeMoveCB(game, turn, notation)
  );

}

function endTurn(gameId) {
  console.log('endTurn');
  Meteor.call('clearTimerInterval', gameId);

  if (Meteor.call('isTimerInPlay', gameId)) {
    var turnIndex = Games.findOne({ gameId: gameId }).turnIndex;
    var move = Meteor.call('protoEndTurn', gameId, turnIndex);
    executeMove(gameId, move, 'clan');
  }
}

function executeMoveCB(game, turn, notation) {
  if (Chess.game_over())
    endGame(game.gameId)
  else
    startTurn(game, turn, notation);
}

function startTurn (game, turn, notation) {
  Meteor.call('startTurnTimer', game.gameId);
  if (turn === 'clan')
    Meteor.setTimeout(promptEngine, 2000);

  function promptEngine() {
    Engine.getMove(game.moves.join(" ") + " " + notation);
  }
}

function clientDone(gameId) {
  var game = validateGame(gameId);
  validateUser(this.userId);
  validateUniqueness(gameId);
  validateSuggestedMoves();

  Games.update(
    { gameId: gameId },
    { $push: { playedThisTurn: Meteor.userId() } },
    function() { if (isAllClientsFinished(gameId)) { endTurn(gameId); } }
  );

  function validateUniqueness() {
    var played = game.playedThisTurn;
    if ( _.contains(played, Meteor.userId()) )
      throw new Meteor.Error(403, 'Already pressed "Im done"');
  }

  function validateSuggestedMoves() {
    var moves = SuggestedMoves.find({gameId: gameId, turnIndex: game.turnIndex}).count();
    if (moves < 1)
      throw new Meteor.Error(403, 'No moves suggested');
  }

}

function isAllClientsFinished(gameId) {
  playersN = getUsersBy({ "status.online": true }).count();
  playedN = Games.findOne({gameId: gameId}).playedThisTurn.length;
  return playersN === playedN;
}

function validateGame(gameId) {
  check(gameId, String);
  var game = Games.findOne({ gameId: gameId });
  if (! game)
    throw new Meteor.Error(404, "No such game");
  return game;
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

function endGame(gameId) {
  Meteor.call('endTimer', gameId);
  
}