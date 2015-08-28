Meteor.publish('games', publish);
Meteor.publish('gamesList', publishList);

Games.after.insert(afterInsert);
Games.before.remove(beforeRemove);

Meteor.methods({
  createGame: create,
  destroyGame: destroy,
  clientDone: clientDone,
  endTurn: endTurn,
  executeMove: executeMove,
  AIGetMoveCb: AIGetMoveCb,
  validateGame: validateGame,
  endGame: endGame,
  restart: restart,
  AIEvaluationCB: AIEvaluationCB
});

var ChessValidators = ChessValidators || {};

var ChessEngines = ChessEngines || {};

var log = _DEV.log('MODEL: GAMES:');

function create(title) {
  return Games.insert({ 
    title: title,
    playedThisTurn: [],
    moves: [],
    pgn: [],
    turnIndex: 1,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  });
}

function destroy(gameId) {
  Games.remove({ _id: gameId });
}

function clientDone(gameId) {
  var game = validateGame(gameId);
  validateUser(Meteor.userId());
  validateUniqueness(game.playedThisTurn);
  Meteor.call('validateSugMovExists', gameId, game.turnIndex);

  Games.update(
    { _id: gameId },
    { $push: { playedThisTurn: Meteor.userId() } },
    endTurnIfAllPlayed(gameId)
  );

}

function endTurn(gameId) {
  Meteor.call('clearTimerInterval', gameId);

  var turnIndex = Games.findOne(gameId).turnIndex;

  if (Meteor.call('noSugMov', gameId, turnIndex))
    return endGame(gameId, 'AI');

  if (Meteor.call('isTimerInPlay', gameId)) {
    executeClanMove(gameId);
  }
}

function executeMove(gameId, move, turn) {
  var notation = move.from + move.to;

  Games.update(
    { _id: gameId },
    {
      $push: {
        moves: notation,
        pgn: move
      },
      $set: {
        turn: turn,
        playedThisTurn: [],
        fen: getFen(gameId, move)
      },
      $inc: {
        turnIndex: 1
      }
    },
    executeMoveCB(gameId, turn, notation)
  );

}

function executeMoveCB(gameId, turn, notation) {
  logMove(gameId, turn, notation);
  if (getChessValidator(gameId).game_over())
    endGame(gameId);
  else
    startTurn(gameId, turn, notation);
}

function AIGetMoveCb(gameId, move) {
  executeMove(gameId, move, "AI");
}

function validateGame(gameId) {
  check(gameId, String);
  var game = Games.findOne(gameId);
  if (! game)
    throw new Meteor.Error(404, "No such game");
  return game;
}

function restart(gameId) {
  validateAdmin()
  getChessValidator(gameId).reset();
  resetGameData(gameId, resetGameDataCB);

  function resetGameDataCB(err, result) {
    if (err) throw new Meteor.Error(403, err);

    Meteor.call('startTurnTimer',gameId);
  }

}

function validateAdmin() {
  if (!Meteor.user() || !Meteor.user().admin)
    throw new Meteor.Error(200, "Only admins can make this action!");
}

function AIEvaluationCB(score) {
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

function resetGameData(gameId, CB) {
  Games.update(
    { _id: gameId },
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
    CB
  );

  Meteor.call('timerResetGame', gameId);
  Evaluations.remove({ gameId: gameId });
  SuggestedMoves.remove({ gameId: gameId });
  Feeds.remove({ gameId: gameId });

}

function executeClanMove(gameId) {
  var turnIndex = Games.findOne(gameId).turnIndex;
  var move = Meteor.call('protoEndTurn', gameId, turnIndex);
  executeMove(gameId, move, 'team');
}

function logMove(gameId, turn, notation) {
  var text = turn + ' played ' + notation;
  var turnIndex = Games.findOne(gameId).turnIndex;
  Meteor.call('log', gameId, turnIndex, text, 'move');
}

function startTurn (gameId, turn, notation) {
  Meteor.call('startTurnTimer', gameId);
  if (turn === 'team')
    Meteor.setTimeout(promptEngine, 2000); // TODO :: timeout is here due to weird bug

  function promptEngine() {
    var moves = getMoves(gameId, notation);
    getChessEngine(gameId).getMove(moves);
  }
}

function getMoves(gameId, notation) {
  return Games.findOne(gameId).moves.join(" ") + " " + notation;
}

function isAllClientsFinished(gameId) {
  playersN = F.getUsersBy({ "status.online": true }).count();
  playedN = Games.findOne(gameId).playedThisTurn.length;
  return playersN === playedN;
}

function validateUser(uid) {
  check(uid, String);
  if (! uid)
    throw new Meteor.Error(403, "You must be logged in");
}

function getFen(gameId, move) {
  getChessValidator(gameId).move(move);
  return getChessValidator(gameId).fen();
}

function endGame(gameId, winner) {
  Meteor.call('endTimer', gameId);
  Games.update({ _id: gameId }, { $set: { winner: winner } });
  logEndGame(gameId, winner);
  function logEndGame(gameId, winner) {
    var text = winner + " wins the game!!";
    Meteor.call('log', gameId, null, text, 'endGame');
  }
}


/********* Publish and hooks *********/
function publish(gameId) {
  return Games.find({ _id: gameId });
}

function publishList(options) {
  return Games.find({});
}

function afterInsert(userId, game) {
  Meteor.call('createTimer', game._id);
}

function beforeRemove(userId, game) {
  var gameId = game._id;
  Meteor.call('destroyTimer', gameId);
  Meteor.call('destroyEvaluations', gameId);
  Meteor.call('destroySugMoves', gameId);
  Meteor.call('destroyFeeds', gameId);
}

function getChessValidator(gameId) {
  return ChessValidators[gameId] = ChessValidators[gameId] || Chess();
}

function getChessEngine(gameId) {
  return ChessEngines[gameId] = ChessEngines[gameId] || Engine(gameId);
}