Meteor.publish('games', publish);
Meteor.publish('gamesList', publishList);

Games.before.remove(beforeRemove);

Meteor.methods({
  createGame: create,
  destroyGame: destroy,
  clientDone: clientDone,
  resetTimer: resetTimer,
  endTurn: endTurn,
  executeMove: executeMove,
  AIGetMoveCb: AIGetMoveCb,
  validateGame: validateGame,
  endGame: endGame,
  restart: restart,
  archiveGame: archive,
  AIEvaluationCB: AIEvaluationCB
});

var ChessValidators = ChessValidators || {};

var ChessEngines = ChessEngines || {};

var log = _DEV.log('MODEL: GAMES:');

function create(title) {
  return Games.insert({ 
    ownerId: Meteor.userId(),
    createdAt: Date.now(),
    title: title,
    score: 0,
    playedThisTurn: [],
    moves: [],
    pgn: [],
    timePerMove: 300000,
    timeMoveStarted: null,
    inPlay: false,
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
  var game = Games.findOne(gameId);

  Games.update(
    { _id: gameId }, 
    { 
      $set: { 
        inPlay: false
      }
    }
  );


  var turnIndex = game.turnIndex;
  if (Meteor.call('noSugMov', gameId, turnIndex))
    return endGame(gameId, 'AI');

  if (game.inPlay) {
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
  cacheGameScore(gameId);
  if (getChessValidator(gameId).game_over())
    endGame(gameId);
  else
    startTurn(gameId, turn, notation);
}

function cacheGameScore(gameId) {
  var game = Games.findOne(gameId);
  var movesStr = movesArrToString(gameId);
  var score = Meteor.call('getAiScoreEvaluation', gameId, movesStr);
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
  validateAdminOrOwner(gameId)
  getChessValidator(gameId).reset();
  resetGameData(gameId, resetGameDataCB);

  function resetGameDataCB(err, result) {
    if (err) throw new Meteor.Error(403, err);

    Meteor.call('resetTimer', gameId);
  } 

}

function archive(gameId) {
  validateAdminOrOwner(gameId);
  destroyChessValidator(gameId);
  destroyChessEngine(gameId);

  Games.update({ _id: gameId }, { $set: { status: 'archived', inPlay: false } });
}

function validateAdminOrOwner(gameId) {
  if (!Meteor.user() || !(User.isAdmin() || User.isOwner(Games.findOne(gameId))))
    throw new Meteor.Error(200, "Only admins or game owners can make this action!");
}

function AIEvaluationCB(gameId, score) {
  Games.update(
    { _id: gameId },
    { $set: { score: score } }
  );
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
        score: 0,
        turnIndex: 1,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      },

      $unset: { winner: "" }
    },
    CB
  );

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
  Meteor.call('resetTimer', gameId);

  if (turn === 'team')
    promptEngine()

  function promptEngine() {
    var moves = getMoves(gameId, notation);
    Meteor.call('getAiMove', gameId, moves);
  }
}

function getMoves(gameId, notation) {
  return movesArrToString(gameId) + " " + notation;
}

function movesArrToString(gameId) {
  return Games.findOne(gameId).moves.join(" ")
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
  Games.update({ _id: gameId }, { $set: { winner: winner, inPlay: false } });
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
  return Games.find({ status: { $not: /archived/ } });
}

function beforeInsert(uid) {
  if (Games.findOne({ status: { $not: /archived/ } })) {
    var msg = "No support for multiple games at the moment"
    log(msg);
    throw new Meteor.Error(400, msg);
  }
}

function beforeRemove(uid, game) {
  var gameId = game._id;
  Meteor.call('destroyEvaluations', gameId);
  Meteor.call('destroySugMoves', gameId);
  Meteor.call('destroyFeeds', gameId);
}

function getChessValidator(gameId) {
  return ChessValidators[gameId] = ChessValidators[gameId] || Chess();
}

function destroyChessValidator(gameId) {
  delete ChessValidators[gameId];
}

function resetTimer(gameId) {
  Games.update(
    { _id: gameId }, 
    { 
      $set: { 
        timeMoveStarted: Date.now(),
        inPlay: true
      }
    }
  );
}