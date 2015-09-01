
Meteor.methods({
  getAiMove: getAiMove
});

var log = _DEV.log('Engine of gameId:');

var stockfish = Meteor.npmRequire('stockfish')();
var engineStack = [];
var engine = getEngine();
var config = { depth: "3" };
// uciCmd('uci');
// uciCmd('ucinewgame');
// uciCmd('isready');


function getAiMove(gameId, moves) {
  engineStack.push(gameId);
  setPosition(moves);
  promptMove();
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

  });

  return eng;
}

// function getEvaler() {
//   var line;
//   var ev = Meteor.npmRequire('stockfish')();
//   ev.onmessage = Meteor.bindEnvironment(function(e) {
//     if (e && typeof e === "object") {
//         line = e.data;
//     } else {
//         line = e;
//     }
//     if (line.indexOf('Total Evaluation') > -1) {
//       var score = parseFloat(line.split('Total Evaluation: ')[1].split('(')[0])
//       Meteor.call('AIEvaluationCB', gameId, score);
//     }
//   });
  
//   return ev;
// }

// moves is a string in the format 'e2e4 e7e5'
// Sets the position of the game to the engine
function setPosition(moves) {
  uciCmd('position startpos moves ' + moves);
}

// Response will be caught at: ev.onmessage
// function evaluate(moves) {
//   setPosition(moves);
//   uciCmd("eval", evaler);
// }

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