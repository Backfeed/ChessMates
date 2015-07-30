Meteor.publish('games', function (options, gameId) {
  return Games.find({"gameId": "1"});
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
  var newTurn = parseInt(game.turnIndex);
  newTurn++;
  var newFen = getFen(move);
  var moveStr = move.from+move.to;
  var moves = game.moves.join(" ") + " " + moveStr;

  setTurn();

  function setTurn() {
    Games.update(
      { gameId: gameId },
      {
        $push: {
          moves: moveStr,
          pgn: move
        },
        $set:  {
          turn: turn,
          turnIndex: newTurn,
          playedThisTurn: [],
          fen: newFen
        }
      },
      initNextTurn
    );
  }
  function initNextTurn () {
    Meteor.call('startTurn',gameId);
    if (turn === 'clan') {
      Meteor.setTimeout(function() {
        Engine.getMove(moves);
      }, 2000);
    }
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
    function() { if (isAllClientsFinished(gameId)) { Meteor.call('endTurn' ,gameId); } }
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
  playersN = Meteor.users.find({ "status.online": true }).count();
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

