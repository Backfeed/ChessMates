Engine = (function Engine() {
  var defer = Meteor.npmRequire('node-promise').defer;
  var engine = getEngine();
  var evaler = getEvaler();
  var config = { depth: "3" };
  var deferredMove;
  var deferredEval;
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
    eng = Meteor.npmRequire('stockfish')();//typeof STOCKFISH === "function" ? STOCKFISH() : new Worker(config.stockfishjs || 'stockfish.js');
    eng.onmessage = function(e) {
      if (e && typeof e === "object") {
          line = e.data;
      } else {
          line = e;
      }
      // console.log("Angular Stockfish: Engine: " + line);
      var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
      if(match) {
        var from      = match[1];
        var to        = match[2];
        var promotion = match[3]
        deferredMove.resolve({ from: from, to: to, promotion: promotion });
      }

    }

    return eng;
  }

  function getEvaler() {
    var line;
    ev = Meteor.npmRequire('stockfish')();//typeof STOCKFISH === "function" ? STOCKFISH() : new Worker(config.stockfishjs || 'stockfish.js');
    ev.onmessage = function(e) {
      if (e && typeof e === "object") {
          line = e.data;
      } else {
          line = e;
      }
      // console.log("Angular Stockfish: Evaler: " + line);
      if (line.indexOf('Total Evaluation') > -1) {
        var evaluationScore = parseFloat(line.split('Total Evaluation: ')[1].split('(')[0])
        deferredEval.resolve(evaluationScore);
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

  function evaluate(moves) {
    deferredEval = defer();
    setPosition(moves);
    uciCmd("eval", evaler);
    return deferredEval.promise;
  }

  // Prompt the engine for move based on position (call setPosition before this method)
  function promptMove() {
    deferredMove = defer();
    if (config.time && config.time.wtime) {
      uciCmd("go depth " + config.depth + " wtime " + config.time.wtime + " winc " + config.time.winc + " btime " + config.time.btime + " binc " + config.time.binc);
    } else {
      uciCmd("go depth " + config.depth);
    }
    return deferredMove.promise;
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
