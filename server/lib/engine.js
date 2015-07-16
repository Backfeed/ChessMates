/* jshint ignore:start */
Engine = (function Engine() {
  var engine = getEngine();
  var evaler = getEvaler();
  var config = { depth: "3" };
  uciCmd('uci');
  uciCmd('ucinewgame');
  uciCmd('isready');

  return {
    setPosition: setPosition,
    getMove: getMove,
    evaluate: evaluate,
    promptMove: promptMove,
    setOptions: setOptions
  };

  function getMove(moves) {
    setPosition(moves);
    return promptMove();
  }

  function getEngine() {
    var line;
    var eng = Meteor.npmRequire('stockfish')();
    eng.onmessage = Meteor.bindEnvironment(function(e) {
      if (e && typeof e === "object") {
          line = e.data;
      } else {
          line = e;
      }
      // console.log("Angular Stockfish: Engine: " + line);
      var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
      if (match) {
        console.log('AI move Match');
        var move = {
          from: match[1],
          to: match[2],
          promotion: match[3]
        };
        Meteor.call('AIGetMoveCb', move);
      }

    });

    return eng;
  }

  function getEvaler() {
    var line;
    var ev = Meteor.npmRequire('stockfish')();
    ev.onmessage = function(e) {
      if (e && typeof e === "object") {
          line = e.data;
      } else {
          line = e;
      }
      // console.log("Angular Stockfish: Evaler: " + line);
      if (line.indexOf('Total Evaluation') > -1) {
        var score = parseFloat(line.split('Total Evaluation: ')[1].split('(')[0])
        Meteor.call('AIEvaluationCB', score);
      }
    }
    return ev;
  }

  // moves is a string in the format 'e2e4 e7e5'
  // Sets the position of the game to the engine
  function setPosition(moves) {
    uciCmd('position startpos moves ' + moves);
    uciCmd('position startpos moves ' + moves, evaler);
  }

  // Response will be caught at: ev.onmessage
  function evaluate(moves) {
    setPosition(moves);
    uciCmd("eval", evaler);
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
  function uciCmd(cmd, evlr) {
    console.log("Angular Stockfish: UCI: " + cmd);
    (evlr || engine).postMessage(cmd);
  }

  function setOptions(options) {
    config = options;
  }

})();
/* jshint ignore:end */
