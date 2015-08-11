Meteor.publish('games', publish);
Games.before.update(beforeUpdate);
Games.after.update(afterUpdate);

Meteor.methods({
  clientDone: clientDone,
  endTurn: endTurn,
  executeMove: executeMove,
  AIGetMoveCb: AIGetMoveCb,
  validateGame: validateGame,
  endGame: endGame,
  restart: restart,
  AIEvaluationCB: AIEvaluationCB
});

function clientDone(gameId) {
  var game = validateGame(gameId);
  validateUser(this.userId);
  validateUniqueness(game.playedThisTurn);
  Meteor.call('validateSugMovExists', gameId, game.turnIndex);

  Games.update(
    { gameId: gameId },
    { $push: { playedThisTurn: Meteor.userId() } },
    endTurnIfAllPlayed(gameId)
  );

}

function endTurn(gameId) {
  Meteor.call('clearTimerInterval', gameId);
  
  var turnIndex = Games.findOne({ gameId: gameId }).turnIndex;
  if (Meteor.call('noSugMov', gameId, turnIndex))
    return endGame(gameId, 'AI');

  if (Meteor.call('isTimerInPlay', gameId)) {
    executeClanMove(gameId);
  }
}

function executeMove(gameId, move, turn) {
  var notation = move.from + move.to;

  Games.update(
    { gameId: gameId },
    {
      $push: {
        moves: notation,
        pgn: move
      },
      $set: {
        turn: turn,
        playedThisTurn: [],
        fen: getFen(move)
      },
      $inc: {
        turnIndex: 1
      }
    },
    executeMoveCB(gameId, turn, notation)
  );

}

function AIGetMoveCb(move) {
  executeMove("1", move, "AI");
}

function validateGame(gameId) {
  check(gameId, String);
  var game = Games.findOne({ gameId: gameId });
  if (! game)
    throw new Meteor.Error(404, "No such game");
  return game;
}

function restart(gameId) {
  Chess.reset();
  resetGameData(gameId);
}

function AIEvaluationCB(score) {
  console.log("score is: ", score);
}


/********* Helper methods *********/
function validateUniqueness(playedThisTurn) {
  if ( _.contains(playedThisTurn, Meteor.userId()) )
    throw new Meteor.Error(403, 'Already pressed "Im done"');
}

function endTurnIfAllPlayed(gameId) { 
  if (isAllClientsFinished(gameId)) 
    endTurn(gameId)
}

function resetGameData(gameId) {
  Games.update(
    { gameId: gameId },
    { 
      $set: {
        playedThisTurn: [],
        moves: [],
        pgn: [],
        turnIndex: 1,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      },

      $unset: { winner: "" }
    },
    restartCB
  );

  Meteor.call('timerResetGame', gameId);
  Evaluations.remove({});
  SuggestedMoves.remove({ gameId: gameId });
  Comments.remove({ gameId: gameId });

  function restartCB(err, result) {
    if (err) throw new Meteor.Error(403, err);
    Meteor.call('startTurnTimer',gameId);
  }
}

function executeClanMove(gameId) {
  var turnIndex = Games.findOne({ gameId: gameId }).turnIndex;
  var move = Meteor.call('protoEndTurn', gameId, turnIndex);
  executeMove(gameId, move, 'clan');
}

function executeMoveCB(gameId, turn, notation) {
  if (Chess.game_over())
    endGame(gameId);
  else
    startTurn(gameId, turn, notation);
}

function startTurn (gameId, turn, notation) {
  Meteor.call('startTurnTimer', gameId);
  if (turn === 'clan')
    Meteor.setTimeout(promptEngine, 2000); // TODO :: timeout is here due to weird bug

  function promptEngine() {
    var moves = getMoves(gameId, notation);
    Engine.getMove(moves);
  }
}

function getMoves(gameId, notation) {
  return Games.findOne({ gameId: gameId }).moves.join(" ") + " " + notation;
}

function isAllClientsFinished(gameId) {
  playersN = getUsersBy({ "status.online": true }).count();
  playedN = Games.findOne({gameId: gameId}).playedThisTurn.length;
  return playersN === playedN;
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

function endGame(gameId, winner) {
  console.log('GAME OVER! WINNER: ', winner);
  Meteor.call('endTimer', gameId);
  Games.update({ gameId: gameId }, { $set: { winner: winner } });
}


/********* Publish and hooks *********/
function publish(options, gameId) {
  return Games.find({"gameId": "1"});
}

function beforeUpdate(userId, doc, fieldNames, modifier, options){
  console.log('before game collection updated');
}

function afterUpdate(userId, doc, fieldNames, modifier, options){
  console.log('after game collection updated');
}