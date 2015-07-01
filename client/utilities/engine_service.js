angular.module('blockchess.utilities.engine', [])
.service('Engine', Engine)

function Engine() {
    
  return {
    setPosition: setPosition,
    promptMove: promptMove,
    setOptions: setOptions
  }

  function getEngine() {
    eng = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker(config.stockfishjs || 'stockfish.js');
    // eng.onMessage = function(e) {
    //   if (e && typeof e === "object") {
    //       line = e.data;
    //   } else {
    //       line = e;
    //   }
    //   console.log("Reply: " + line)
    // }

    return eng;
  }

  function getEvaler() {
    ev = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker(config.stockfishjs || 'stockfish.js');
    // ev.onmessage = function(e) {
    //   if (e && typeof e === "object") {
    //       line = e.data;
    //   } else {
    //       line = e;
    //   }
    //   console.log("Reply: " + line)
    // }
    return ev;
  }

  function setPosition(moves) {
    uciCmd('position startpos moves ' + moves);
    uciCmd('position startpos moves ' + moves, evaler);
  }

  function promptMove() {
    if (time && time.wtime) {
      uciCmd("go depth " + config.depth + " wtime " + time.wtime + " winc " + time.winc + " btime " + time.btime + " binc " + time.binc);
    } else {
      uciCmd("go depth " + config.depth);
    }
  }

  function uciCmd(cmd) {
    console.log("UCI: " + cmd);
    engine.postMessage(cmd);
  }

  function setOptions(options) {
    config = options;
  }

}