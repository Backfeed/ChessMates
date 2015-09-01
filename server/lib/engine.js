Meteor.methods({
  getAiMove: getAiMove,
  getAiScoreEvaluation: getAiScoreEvaluation
});

var log = _DEV.log('Engine');

var stockfish = Meteor.npmRequire('stockfish')();

// This is EXTREMELY bad practice
// Stockish doesn't have multi-thread support, and it works on WEB Workers
// The result is we can only run one instance of the AI in the entire app
// So all games share same AI. So there's no way to assign callbacks to their gameId (the game who "called" them)
// This erray holds some sort of an "index" to the calls. So before each call we push the gameId of that call to the array.
// Then in the CB we retrieve it
// TODO :: Make it work with promises
var engineStack = [];

var engine = getEngine();
var config = { depth: "3" };


function getAiMove(gameId, moves) {
  engineStack.push(gameId);
  setPosition(moves);
  promptMove();
}

// Response will be caught at onmessage
function getAiScoreEvaluation(gameId, moves) {
  engineStack.push(gameId);
  setPosition(moves);
  uciCmd("eval");
}

function getEngine() {
  var line;
  var eng = stockfish;
  eng.onmessage = Meteor.bindEnvironment(function(e) {
    if (e && typeof e === "object") {
        line = e.data;
    } else {
        line = e;
    }
    var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
    
    if (match) {
      var move = {
        from: match[1],
        to: match[2],
        promotion: match[3]
      };
      var gameId = engineStack.shift();
      log('AIGetMoveCb', gameId, move);
      Meteor.call('AIGetMoveCb', gameId, move);
    }

    if (line.indexOf('Total Evaluation') > -1) {
      var gameId = engineStack.shift();
      var score = parseFloat(line.split('Total Evaluation: ')[1].split('(')[0])
      log('AIEvaluationCB', gameId, score);
      Meteor.call('AIEvaluationCB', gameId, score);
    }

  });

  return eng;
}

// moves is a string in the format 'e2e4 e7e5'
// Sets the position of the game to the engine
function setPosition(moves) {
  uciCmd('position startpos moves ' + moves);
}

// Prompt the engine for move based on position (call setPosition before this method)
// Response will be caught at: eng.onmessage
function promptMove() {
  if (config.time && config.time.wtime) {
    uciCmd("go depth " + config.depth + " wtime " + config.time.wtime + " winc " + config.time.winc + " btime " + config.time.btime + " binc " + config.time.binc);
  } else {
    uciCmd("go depth " + config.depth);
  }
}

// Send commands to the engine
function uciCmd(cmd) {
  engine.postMessage(cmd);
}